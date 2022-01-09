import { App } from '../../interfaces/globlal';
import multer from 'fastify-multer'
import { resizeImages, uploadImagesToGCS } from '../../middlewares/handleImage';

const upload = multer({ storage: multer.memoryStorage() })

const memeRoutes = (app: App, _: any, done: any) => {

  app.post('/', {
    preHandler: [
      upload.any(),
      resizeImages,
      uploadImagesToGCS
    ]
  },(request, reply) => {
    const files:any = request
    console.log(files.files)
    reply.send('hi')
  })


  done()
}

export default memeRoutes
