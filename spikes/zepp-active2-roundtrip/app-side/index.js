import '../shared/device-polyfill'
import { MessageBuilder } from '../shared/message-side'
import { TEST_RECEIVER_URL } from './receiver-config.local'

const SCHEMA_VERSION = 1
const EVENT_TYPE = 'WATCH_PING'
const EVENT_KEYS = ['deviceTimestamp', 'eventId', 'eventType', 'schemaVersion', 'sessionId']
const REJECTION = {
  INVALID_MESSAGE: 'REJECTED_INVALID_MESSAGE',
  RECEIVER_NOT_CONFIGURED: 'REJECTED_RECEIVER_NOT_CONFIGURED',
  RECEIVER_INVALID_URL: 'REJECTED_RECEIVER_INVALID_URL',
  RECEIVER_HTTP: 'REJECTED_RECEIVER_HTTP',
  RECEIVER_NETWORK: 'REJECTED_RECEIVER_NETWORK',
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.length > 0
}

function isUuidV4(value) {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function eventSuffix(eventId) {
  return isUuidV4(eventId) ? eventId.slice(-8) : 'unknown'
}

function logResult(eventId, result) {
  console.log(`watch-ping type=${EVENT_TYPE} idSuffix=${eventSuffix(eventId)} result=${result}`)
}

function isWatchPing(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const keys = Object.keys(value).sort()
  return keys.length === EVENT_KEYS.length &&
    keys.every((key, index) => key === EVENT_KEYS[index]) &&
    value.schemaVersion === SCHEMA_VERSION &&
    value.eventType === EVENT_TYPE &&
    isUuidV4(value.eventId) &&
    isUuidV4(value.sessionId) &&
    typeof value.deviceTimestamp === 'number' &&
    Number.isFinite(value.deviceTimestamp) &&
    value.deviceTimestamp > 0
}

function responseFor(eventId, status) {
  return {
    schemaVersion: SCHEMA_VERSION,
    eventId: isUuidV4(eventId) ? eventId : null,
    receivedAt: Date.now(),
    status,
  }
}

function isHttpsUrl(value) {
  return typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value)
}

function rejection(status) {
  const error = new Error(status)
  error.status = status
  return error
}

const messageBuilder = new MessageBuilder()

async function forwardToReceiver(event) {
  if (!isNonEmptyString(TEST_RECEIVER_URL)) {
    throw rejection(REJECTION.RECEIVER_NOT_CONFIGURED)
  }

  if (!isHttpsUrl(TEST_RECEIVER_URL)) {
    throw rejection(REJECTION.RECEIVER_INVALID_URL)
  }

  let receiverResponse
  try {
    receiverResponse = await fetch({
      url: TEST_RECEIVER_URL,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
  } catch (_) {
    throw rejection(REJECTION.RECEIVER_NETWORK)
  }

  if (!receiverResponse || receiverResponse.status < 200 || receiverResponse.status >= 300) {
    throw rejection(REJECTION.RECEIVER_HTTP)
  }

  return responseFor(event.eventId, 'ACCEPTED')
}

AppSideService({
  onInit() {
    messageBuilder.listen()
    messageBuilder.on('request', ({ request, response }) => {
      const command = messageBuilder.buf2Json(request.payload)
      if (!command || command.method !== 'SEND_WATCH_PING' || !isWatchPing(command.params)) {
        const eventId = command && command.params && command.params.eventId
        logResult(eventId, REJECTION.INVALID_MESSAGE)
        response({ data: responseFor(eventId, REJECTION.INVALID_MESSAGE) })
        return
      }

      const event = command.params
      logResult(event.eventId, 'RECEIVED')
      forwardToReceiver(event)
        .then((ack) => {
          logResult(event.eventId, 'ACCEPTED')
          response({ data: ack })
        })
        .catch((error) => {
          const status = error && error.status ? error.status : REJECTION.RECEIVER_NETWORK
          logResult(event.eventId, status)
          response({ data: responseFor(event.eventId, status) })
        })
    })
  },
})
