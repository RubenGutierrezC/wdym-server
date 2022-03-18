import sharp from 'sharp'
import { Storage } from '@google-cloud/storage'
import { nanoid } from 'nanoid'
import axios from 'axios'
import { FirsebaseStorageCredentials } from '../config'

const storage = new Storage({
  projectId: 'wdym-142f1',
  credentials: FirsebaseStorageCredentials
})

const bucket = storage.bucket('wdym-142f1.appspot.com')

export const downloadAndResizeImageFromUrl = async (
  request: any,
  reply: any,
  done: any
) => {
  try {
    const photoToDonwload = request.body?.photos[0]

    const { data } = await axios.get(photoToDonwload, {
      responseType: 'arraybuffer'
    })

    const file = await sharp(data)
      .resize(300, 300, {
        fit: 'fill',
        withoutEnlargement: true
      })
      .toFormat('webp')
      .toBuffer()

    request.files = [{}]

    request.files[0].mimetype = 'image/webp'
    request.files[0].buffer = file
  } catch (error) {
    reply.send(error)
  }
}

export const resizeImages = (request: any, reply: any, done: any) => {
  try {
    const files = request.files || []

    if (files.length === 0) return

    const file = files[0]

    sharp(file?.buffer)
      .resize(300, 300, {
        fit: 'fill',
        withoutEnlargement: true
      })
      .toFormat('webp')
      .toBuffer()
      .then((data) => {
        request.files[0].mimetype = 'image/webp'
        request.files[0].buffer = data
      })
      .catch((error) => {
        console.log('erro sharp', error)
        reply.send(error)
      })
  } catch (error) {
    reply.send('error')
  }
}

export const uploadImagesToGCS = async (request: any, reply: any) => {
  if (request.files?.length === 0) return

  try {
    for await (const [index, image] of request?.files?.entries()) {
      const gcsname = nanoid() + '.webp'

      const file = bucket.file(gcsname)

      await file.save(image.buffer, {
        contentType: image.mimetype,
        public: true
      })

      request.files[index].url = file.publicUrl()
    }
  } catch (error) {
    reply.send(error)
  }
}
