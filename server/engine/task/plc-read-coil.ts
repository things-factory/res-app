import { Connections } from '@things-factory/integration-base'
import { TaskRegistry } from '@things-factory/integration-base'
import { MitsubishiPLCConnector } from '../connector/mitsubishi-plc'

async function plcReadCoil(step, { logger }) {
  var {
    connection,
    params: { plcAddress: address }
  } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  var deviceCode = address.substring(0, 1) + '*'
  var af_address = Number(address.substring(1)).toString()
  var len = af_address.length
  for (var i = 0; i < 6 - len; i++) {
    af_address = '0' + af_address
  }
  var readStartDevice = af_address
  var sendMessage = MitsubishiPLCConnector.getReadCoilCommand(deviceCode, readStartDevice)

  await socket.write(sendMessage)
  logger.info(sendMessage)

  var response = await socket.read()
  if (!response) {
    // socket ended or closed
    throw new Error('socket closed')
  }

  var content = response.toString()

  if (content.substring(17, 18) == '5') {
    var data = content.substring(22, 23)

    logger.info(`received response is ok. received: ${data}`)

    return {
      data
    }
  } else {
    // error
    throw new Error('response not applicable')
  }
}

plcReadCoil.parameterSpec = [
  {
    type: 'string',
    name: 'plcAddress',
    label: 'plcAddress'
  }
]

TaskRegistry.registerTaskHandler('plc-read-coil', plcReadCoil)
