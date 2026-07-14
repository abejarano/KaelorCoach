import * as hmUI from '@zos/ui'
import { BUTTON, EVENT_ID, STATUS } from 'zosLoader:./index.[pf].layout.js'

const SCHEMA_VERSION = 1
const EVENT_TYPE = 'WATCH_PING'
const SESSION_ID = createUuid()

function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16)
    const value = character === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

function createEventId() {
  return createUuid()
}

function shortEventId(eventId) {
  return eventId.slice(-12)
}

function rejectionStatus(ack) {
  switch (ack.status) {
    case 'REJECTED_INVALID_MESSAGE':
      return 'ERROR MENSAJE'
    case 'REJECTED_RECEIVER_NOT_CONFIGURED':
    case 'REJECTED_RECEIVER_INVALID_URL':
      return 'ERROR CONFIG'
    case 'REJECTED_RECEIVER_HTTP':
      return 'ERROR HTTP'
    case 'REJECTED_RECEIVER_NETWORK':
      return 'ERROR RED'
    default:
      return 'ERROR ENVIO'
  }
}

Page({
  state: {},
  build() {
    this.state.status = hmUI.createWidget(hmUI.widget.TEXT, { ...STATUS, text: 'LISTO' })
    this.state.eventId = hmUI.createWidget(hmUI.widget.TEXT, { ...EVENT_ID, text: 'Sin envío' })
    this.state.button = hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      text: 'Enviar prueba',
      click_func: () => this.sendWatchPing(),
    })
  },
  setStatus(text) {
    this.state.status.setProperty(hmUI.prop.TEXT, text)
  },
  sendWatchPing() {
    const event = {
      schemaVersion: SCHEMA_VERSION,
      eventId: createEventId(),
      eventType: EVENT_TYPE,
      deviceTimestamp: Date.now(),
      sessionId: SESSION_ID,
    }

    this.setStatus('ENVIANDO')
    this.state.eventId.setProperty(hmUI.prop.TEXT, `ID ${shortEventId(event.eventId)}`)
    const messageBuilder = getApp()._options.globalData.messageBuilder
    messageBuilder.request(
      { method: 'SEND_WATCH_PING', params: event },
      { timeout: 10000 },
    )
      .then((ack) => {
        if (ack && ack.schemaVersion === SCHEMA_VERSION && ack.status === 'ACCEPTED' && ack.eventId === event.eventId) {
          this.setStatus('ACEPTADO')
          return
        }
        if (ack && ack.schemaVersion === SCHEMA_VERSION && ack.eventId === event.eventId &&
          typeof ack.status === 'string' && ack.status.indexOf('REJECTED_') === 0) {
          this.setStatus(rejectionStatus(ack))
          return
        }
        this.setStatus('ERROR ACK')
      })
      .catch(() => this.setStatus('ERROR ENVIO'))
  },
})
