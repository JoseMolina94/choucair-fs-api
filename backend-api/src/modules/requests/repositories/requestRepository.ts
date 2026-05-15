import { randomUUID } from 'node:crypto'
import type { CreateRequestInput, Request } from '../types/request.js'

const requests = new Map<string, Request>()

export function findAllRequests(): Request[] {
  return [...requests.values()].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  )
}

export function findRequestById(id: string): Request | undefined {
  return requests.get(id)
}

export function createRequest(input: CreateRequestInput): Request {
  const request: Request = {
    id: randomUUID(),
    title: input.title,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }
  requests.set(request.id, request)
  return request
}

export function saveRequest(request: Request): Request {
  requests.set(request.id, request)
  return request
}

export function clearRequests(): void {
  requests.clear()
}
