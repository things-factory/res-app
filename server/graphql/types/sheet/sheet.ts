import { gql } from 'apollo-server-koa'

export const Sheet = gql`
  type Sheet {
    id: String
    name: String
    description: String
    board: Board
    active: Boolean
    domain: Domain
    createdAt: String
    creator: User
    updatedAt: String
    updater: User
  }
`
