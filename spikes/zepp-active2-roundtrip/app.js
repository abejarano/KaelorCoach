import './shared/device-polyfill'
import { getPackageInfo } from '@zos/app'
import * as ble from '@zos/ble'
import { MessageBuilder } from './shared/message'

const { appId } = getPackageInfo()
const messageBuilder = new MessageBuilder({ appId, appDevicePort: 20, appSidePort: 0, ble })

App({
  globalData: { messageBuilder },
  onCreate() {
    messageBuilder.connect()
  },
  onDestroy() {
    messageBuilder.disConnect()
  },
})
