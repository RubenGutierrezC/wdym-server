import { App } from '../../interfaces/globlal'
import phraseController from './phraseController'

const phraseRoutes = (app: App, _: any, done: any) => {
  app.post('/', phraseController.postPhrase)

  app.get('/', phraseController.getPhrases)

  app.get('/:id', phraseController.getOnePhrase)

  done()
}

export default phraseRoutes
