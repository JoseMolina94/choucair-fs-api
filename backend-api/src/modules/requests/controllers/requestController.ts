import type { RequestHandler } from 'express'
import { AppError } from '../../../shared/errors/AppError.js'
import {
  createRequest,
  listRequests,
  updateRequestStatus,
} from '../services/requestService.js'
import type { UpdateRequestStatusInput } from '../types/request.js'

function getRouteId(id: string | string[]): string {
  if (typeof id !== 'string') {
    throw new AppError('ID inválido', 400)
  }
  return id
}

export const getRequests: RequestHandler = (_req, res) => {
  res.json(listRequests())
}

export const postRequest: RequestHandler = (req, res) => {
  const created = createRequest(req.body)
  res.status(201).json(created)
}

export const patchRequest: RequestHandler = (req, res) => {
  const updated = updateRequestStatus(
    getRouteId(req.params.id),
    req.body as UpdateRequestStatusInput,
  )
  res.json(updated)
}
