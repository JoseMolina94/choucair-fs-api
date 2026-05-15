import { useState } from 'react'
import { useRequests } from '../hooks/useRequests'
import { canChangeStatus } from '../utils/canChangeStatus'
import './RequestListPage.css'

export function RequestListPage() {
  const { requests, isLoading, error, reload, addRequest, setStatus } =
    useRequests()
  const [title, setTitle] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    setActionError(null)
    try {
      await addRequest(trimmed)
      setTitle('')
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'No se pudo crear la solicitud',
      )
    }
  }

  const handleStatusChange = async (
    id: string,
    status: 'APPROVED' | 'REJECTED',
  ) => {
    setActionError(null)
    try {
      await setStatus(id, status)
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'No se pudo actualizar la solicitud',
      )
    }
  }

  if (isLoading) {
    return <p className="requests-message">Cargando solicitudes…</p>
  }

  if (error) {
    return (
      <section className="requests-message">
        <p>{error}</p>
        <button type="button" onClick={() => void reload()}>
          Reintentar
        </button>
      </section>
    )
  }

  return (
    <section className="requests-page">
      <header className="requests-header">
        <h1>Solicitudes</h1>
        <p>Gestión de solicitudes con flujo de aprobación</p>
      </header>

      <form className="requests-form" onSubmit={handleCreate}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Título de la solicitud"
          aria-label="Título de la solicitud"
        />
        <button type="submit" disabled={!title.trim()}>
          Crear
        </button>
      </form>

      {actionError && <p className="requests-error">{actionError}</p>}

      {requests.length === 0 ? (
        <p className="requests-message">No hay solicitudes.</p>
      ) : (
        <ul className="requests-list">
          {requests.map((request) => (
            <li key={request.id} className="requests-item">
              <div className="requests-item-body">
                <strong>{request.title}</strong>
                <span className={`status status-${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
                <time dateTime={request.createdAt}>
                  {new Date(request.createdAt).toLocaleString()}
                </time>
              </div>
              {canChangeStatus(request) && (
                <div className="requests-actions">
                  <button
                    type="button"
                    onClick={() => void handleStatusChange(request.id, 'APPROVED')}
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => void handleStatusChange(request.id, 'REJECTED')}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
