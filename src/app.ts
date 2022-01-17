import { fastify } from 'fastify'
import fastifyIO from 'fastify-socket.io'
import middie from 'middie'
import cors from 'cors'
import helmet from 'fastify-helmet'
import { contentParser } from 'fastify-multer'
import { App } from './interfaces/globlal'
import { initSocket } from './sockets/index'
import memeRoutes from './components/memes/memeRoutes'
import phraseRoutes from './components/phrases/phraseRoutes'

const app: App = fastify({
  logger: true
})

const subsystem = async (app: App) => {
  await app.register(middie)
  app.use(cors())
}

app.register(subsystem)
app.register(fastifyIO, {
  cors: {
    origin: '*'
  }
})
app.register(contentParser)
app.register(helmet)

//routes
app.register(memeRoutes, { prefix: '/v1/meme' })
app.register(phraseRoutes, { prefix: '/v1/phrase' })

app.ready().then(() => initSocket(app))

export default app
