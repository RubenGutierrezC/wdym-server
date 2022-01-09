import { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from 'http'
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from 'socket.io';

export type App = FastifyInstance<Server, IncomingMessage, ServerResponse>

export type SocketCallback = () => void

export type SocketConnected = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export interface DefaultSocketMethod<T, R = any>  {
  cb?: (data: R) => void
  socket?: SocketConnected
  data: T
}

export type SocketMethodProps<T, R = null, U = {}> = DefaultSocketMethod<T, R> & U