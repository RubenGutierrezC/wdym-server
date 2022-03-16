import { App } from '../../interfaces/globlal'
import multer from 'fastify-multer'
import {
  resizeImages,
  uploadImagesToGCS,
  downloadAndResizeImageFromUrl
} from '../../middlewares/handleImage'
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

  app.post(
    '/bot',
    {
      preHandler: [downloadAndResizeImageFromUrl, uploadImagesToGCS]
    },
    memeController.postMeme
  )

  app.get('/', memeController.getMemes)

  app.get('/:id', memeController.getOneMeme)
  done()
}

export default memeRoutes
