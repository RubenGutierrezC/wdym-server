import { App } from '../../interfaces/globlal'
import multer from 'fastify-multer'
import { resizeImages, uploadImagesToGCS } from '../../middlewares/handleImage'
import memeController from './memeController'

const upload = multer({ storage: multer.memoryStorage() })

const memeRoutes = (app: App, _: any, done: any) => {
  app.post(
    '/',
    {
      preHandler: [upload.any(), resizeImages, uploadImagesToGCS]
    },
    memeController.postMeme
  )

  app.get('/', memeController.getMemes)

  app.get('/:id', memeController.getOneMeme)
  done()
}

export default memeRoutes
