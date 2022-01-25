import chalk from 'chalk'
import app from '../app'
import { initMongoDB } from '../services/database'
import { PORT } from '../config/index'
import { redisClient } from '../services/redis'

const startServer = async () => {
  try {
    await app.listen(PORT)
    await initMongoDB()

    await redisClient.connect()

    console.log(
      chalk.green.bold('server running on port: ', chalk.underline(PORT))
    )
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

startServer()
