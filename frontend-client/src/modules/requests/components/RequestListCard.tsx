import type { Request, RequestStatus } from '../types/request'
import { canChangeStatus } from '../utils/canChangeStatus'

type RequestListCardProps = {
  request: Request
  onStatusChange: (
    id: string,
    status: Extract<RequestStatus, 'APPROVED' | 'REJECTED'>,
  ) => void
}

export function RequestListCard({
  request,
  onStatusChange,
}: RequestListCardProps) {
  return (
    <li className="requests-item">
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
            onClick={() => onStatusChange(request.id, 'APPROVED')}
          >
            Aprobar
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => onStatusChange(request.id, 'REJECTED')}
          >
            Rechazar
          </button>
        </div>
      )}
    </li>
  )
}
