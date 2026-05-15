import { apiClient } from '@/shared/api/client'
import type {
  CreateRequestPayload,
  Request,
  UpdateRequestStatusPayload,
} from '../types/request'

export function fetchRequests(): Promise<Request[]> {
  return apiClient<Request[]>('/requests')
}

export function createRequest(
  payload: CreateRequestPayload,
): Promise<Request> {
  return apiClient<Request>('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateRequestStatus(
  id: string,
  payload: UpdateRequestStatusPayload,
): Promise<Request> {
  return apiClient<Request>(`/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
