import { FastifyInstance } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Socket } from 'socket.io'

export type App = FastifyInstance<Server, IncomingMessage, ServerResponse>

export type SocketCallback = () => void

export type SocketConnected = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>

export type DefaultSocketMethod<T = null, R = any> = T extends null
  ? {
      cb?: (data: R) => data
      socket?: SocketConnected
    }
  : {
      cb?: (data: R) => data
      socket?: SocketConnected
      data: T
    }

export type SocketMethodProps<T = null, R = null, U = {}> = DefaultSocketMethod<
  T,
  R
> &
  U
