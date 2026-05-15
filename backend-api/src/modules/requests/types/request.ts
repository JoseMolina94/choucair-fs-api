export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Request {
  id: string
  title: string
  status: RequestStatus
  createdAt: string
}

export type CreateRequestInput = {
  title: string
}

export type UpdateRequestStatusInput = {
  status: Extract<RequestStatus, 'APPROVED' | 'REJECTED'>
}
