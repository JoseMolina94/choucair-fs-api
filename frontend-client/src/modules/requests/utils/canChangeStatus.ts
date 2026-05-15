import type { Request } from '../types/request'

/** Spec: solo PENDING puede aprobarse o rechazarse. */
export function canChangeStatus(request: Request): boolean {
  return request.status === 'PENDING'
}
