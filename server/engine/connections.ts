import { config } from '@things-factory/env'
import { ConnectionConfig, Connector } from './types'

export class Connections {
  private static connectors: { [propName: string]: Connector } = {}
  private static connections = {}

  static ready() {
    const CONNECTIONS: ConnectionConfig[] = config.get('connections') as ConnectionConfig[]

    return Promise.all(
      Object.keys(Connections.connectors).map(type => {
        var connector = Connections.connectors[type]
        return connector.ready(CONNECTIONS.filter(connection => connection.connector == type))
      })
    )
  }

  static registerConnector(type, connector) {
    Connections.connectors[type] = connector
  }

  static getConnector(type) {
    return Connections.connectors[type]
  }

  static getConnectors(): { [propName: string]: Connector } {
    return {
      ...Connections.connectors
    }
  }

  static unregisterConnector(type) {
    delete Connections.connectors[type]
  }

  static getConnection(name) {
    return Connections.connections[name]
  }

  static getConnections() {
    return {
      ...Connections.connections
    }
  }

  static addConnection(name, connection) {
    Connections.connections[name] = connection
  }

  static removeConnection(name) {
    delete Connections.connections[name]
  }
}