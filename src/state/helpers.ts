import { Api } from 'services/api'

export interface SagaContext {
  readonly api: Api
}

export type RequestStatus = 'NONE' | 'IN_PROGRESS' | 'ERROR' | 'SUCCESS'
