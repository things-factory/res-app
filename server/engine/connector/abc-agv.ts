import { Connector } from '../types'
import { Connections } from '../connections'

export class ABCAgv implements Connector {
  ready() {
    return null
  }

  async connect(connection) {}
  async disconnect(name) {}
}

Connections.registerConnector('abc-agv', new ABCAgv())
