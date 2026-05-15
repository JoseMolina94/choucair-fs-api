import type { Request } from '../types/request.js'

/** Spec: solo PENDING puede aprobarse o rechazarse. */
export function canChangeStatus(request: Request): boolean {
  return request.status === 'PENDING'
}
