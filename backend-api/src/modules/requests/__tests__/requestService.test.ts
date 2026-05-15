import { beforeEach, describe, expect, it } from 'vitest'
import { clearRequests } from '../repositories/requestRepository.js'
import {
  createRequest,
  updateRequestStatus,
} from '../services/requestService.js'

describe('requestService', () => {
  beforeEach(() => {
    clearRequests()
  })

  it('rechaza crear solicitud sin título', () => {
    expect(() => createRequest({ title: '   ' })).toThrow(
      'El título es obligatorio',
    )
  })

  it('no permite aprobar una solicitud que ya está aprobada', () => {
    const created = createRequest({ title: 'Compra de equipo' })
    updateRequestStatus(created.id, { status: 'APPROVED' })

    expect(() =>
      updateRequestStatus(created.id, { status: 'REJECTED' }),
    ).toThrow('Solo se puede aprobar o rechazar una solicitud en estado PENDING')
  })
})
