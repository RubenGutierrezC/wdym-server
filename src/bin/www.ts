import chalk from 'chalk'
import app from "../app"
import { initMongoDB } from "../services/database"
import { PORT } from '../config/index';

const startServer = async () => {
  try {

    await app.listen(PORT)
    await initMongoDB()
    console.log( chalk.green.bold('server running on port: ', chalk.underline(PORT) ) )
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

startServer()