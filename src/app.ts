import { fastify } from 'fastify'
import fastifyIO from "fastify-socket.io";
import middie from 'middie'
import cors from 'cors'
import helmet from 'helmet'
import { App } from './interfaces/globlal';
import { initSocket } from './sockets/index';

const app: App = fastify({
  logger: true
})

const subsystem = async (app: App) => {
  await app.register(middie)
  app.use(cors())
  app.use(helmet())
}

app.register(subsystem)
app.register(fastifyIO, {
  cors: {
    origin: '*'
  }
})

let rooms = {

}

app.ready().then(() => initSocket(app))

export default app