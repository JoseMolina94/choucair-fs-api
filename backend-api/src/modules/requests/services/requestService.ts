import { AppError } from '../../../shared/errors/AppError.js'
import {
  createRequest as createRequestInStore,
  findAllRequests,
  findRequestById,
  saveRequest,
} from '../repositories/requestRepository.js'
import type {
  CreateRequestInput,
  Request,
  RequestStatus,
  UpdateRequestStatusInput,
} from '../types/request.js'
import { canChangeStatus } from '../utils/canChangeStatus.js'

const FINAL_STATUSES: RequestStatus[] = ['APPROVED', 'REJECTED']

export function listRequests(): Request[] {
  return findAllRequests()
}

export function createRequest(input: CreateRequestInput): Request {
  const title = input.title?.trim()
  if (!title) {
    throw new AppError('El título es obligatorio', 400)
  }

  return createRequestInStore({ title })
}

export function updateRequestStatus(
  id: string,
  input: UpdateRequestStatusInput,
): Request {
  const request = findRequestById(id)
  if (!request) {
    throw new AppError('Solicitud no encontrada', 404)
  }

  if (!input.status || !FINAL_STATUSES.includes(input.status)) {
    throw new AppError('Estado inválido', 400)
  }

  if (!canChangeStatus(request)) {
    throw new AppError(
      'Solo se puede aprobar o rechazar una solicitud en estado PENDING',
      409,
    )
  }

  return saveRequest({ ...request, status: input.status })
}
