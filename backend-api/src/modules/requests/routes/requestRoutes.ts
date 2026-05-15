import { Router } from 'express'
import {
  getRequests,
  patchRequest,
  postRequest,
} from '../controllers/requestController.js'

export const requestRoutes = Router()

requestRoutes.get('/', getRequests)
requestRoutes.post('/', postRequest)
requestRoutes.patch('/:id', patchRequest)
