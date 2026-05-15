import { useCallback, useEffect, useState } from 'react'
import {
  createRequest,
  fetchRequests,
  updateRequestStatus,
} from '../services/requestsApi'
import type { Request, RequestStatus } from '../types/request'

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchRequests()
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar solicitudes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const addRequest = async (title: string) => {
    const created = await createRequest({ title })
    setRequests((prev) => [created, ...prev])
    return created
  }

  const setStatus = async (id: string, status: Extract<RequestStatus, 'APPROVED' | 'REJECTED'>) => {
    const updated = await updateRequestStatus(id, { status })
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? updated : item)),
    )
    return updated
  }

  return {
    requests,
    isLoading,
    error,
    reload: load,
    addRequest,
    setStatus,
  }
}
