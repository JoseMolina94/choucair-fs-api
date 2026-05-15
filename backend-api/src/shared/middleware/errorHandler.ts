import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/AppError.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message })
    return
  }

  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
}
