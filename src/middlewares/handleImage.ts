import sharp from 'sharp'
import path from 'path'
import { Storage } from '@google-cloud/storage'
import { nanoid } from 'nanoid';

const storage = new Storage({
  projectId: 'wdym-142f1',
  keyFilename: './wdym-config.json'
})

const bucket = storage.bucket('wdym-142f1.appspot.com')


export const resizeImages = (request: any, reply: any, done: any) => {
  try {
    const files = request.files || []

    if (files.length > 0) {

      const file = files[0]

      sharp(file?.buffer)
        .resize(300, 300, {
          fit: 'fill',
          withoutEnlargement: true
        })
        .toFormat('webp')
        .toBuffer()
        .then(data => {
          request.files[0].buffer = data
          done()
        })
        .catch(error => {
          console.log('erro sharp', error); 
          reply.send(error)
        })

    } else {
      done()
    }
  } catch (error) {
    reply.send('error')
  }
}

export const uploadImagesToGCS = async (request: any, reply: any, done: any) => {
  console.log(request.files)

  if (request.files?.length === 0) return done()

  let promises = []

  try {
    
    for (const [index, image] of request.files.entries()) {

      const gcsname = nanoid() + path.extname(image.originalname).toLocaleLowerCase()

      const file = bucket.file(gcsname)

      const stream = file.createWriteStream({
        metadata: {
          contentType: image.mimetype
        },
        resumable: false
      })

      stream.on('error', (err) => {
        image.cloudStorageError = err
        done(err)
      })

      stream.end(image.buffer)


      promises.push(
        new Promise((resolve, reject) => {
          stream.on('finish', () => {
            console.log('iteracion')

            const publicUrl = 
              `https://storage.googleapis.com/${bucket.name}/${file.name}`
            
            request.files[index].url = publicUrl

            bucket
              .file(gcsname)
              .makePublic()
              .then(() => resolve(''))

          })
        })
      )

    }

    await Promise.all(promises)
    done()

  } catch (error) {
    console.log('error upload', error)
  }

}