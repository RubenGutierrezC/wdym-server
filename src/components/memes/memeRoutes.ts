import { App } from '../../interfaces/globlal'
import multer from 'fastify-multer'
import { resizeImages, uploadImagesToGCS } from '../../middlewares/handleImage'
import memeController from './memeController'
import { redisClient } from '../../services/redis'

const upload = multer({ storage: multer.memoryStorage() })

const memeRoutes = (app: App, _: any, done: any) => {
  app.post(
    '/',
    {
      preHandler: [upload.any(), resizeImages, uploadImagesToGCS]
    },
    memeController.postMeme
  )

  app.post('/testredis', async (req: any, reply: any) => {
    const res = await redisClient.json.set(
      `room-${req.body.roomCode}`,
      'participants',
      ['', '']
    )
    return reply.send(res)
  })

  app.get('/', memeController.getMemes)

  app.get('/:id', memeController.getOneMeme)
  done()
}

export default memeRoutes
