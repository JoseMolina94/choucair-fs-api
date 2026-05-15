import { describe, expect, it } from 'vitest'
import type { Request } from '../types/request'
import { canChangeStatus } from '../utils/canChangeStatus'

const baseRequest: Request = {
  id: '1',
  title: 'Solicitud de prueba',
  status: 'PENDING',
  createdAt: new Date().toISOString(),
}

describe('canChangeStatus', () => {
  it('permite cambiar estado cuando la solicitud está PENDING', () => {
    expect(canChangeStatus(baseRequest)).toBe(true)
  })

  it('no permite aprobar o rechazar si ya está APPROVED', () => {
    expect(canChangeStatus({ ...baseRequest, status: 'APPROVED' })).toBe(false)
  })

  it('no permite aprobar o rechazar si ya está REJECTED', () => {
    expect(canChangeStatus({ ...baseRequest, status: 'REJECTED' })).toBe(false)
  })
})
