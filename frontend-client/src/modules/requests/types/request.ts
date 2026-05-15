export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Request {
  id: string
  title: string
  status: RequestStatus
  createdAt: string
}

export type CreateRequestPayload = Pick<Request, 'title'>

export type UpdateRequestStatusPayload = {
  status: Extract<RequestStatus, 'APPROVED' | 'REJECTED'>
}
