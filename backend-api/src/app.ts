import cors from 'cors'
import express from 'express'
import { requestRoutes } from './modules/requests/index.js'
import { errorHandler } from './shared/middleware/errorHandler.js'
import { setupSwagger } from './shared/swagger/setupSwagger.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  setupSwagger(app)

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/requests', requestRoutes)
  app.use(errorHandler)

  return app
}
