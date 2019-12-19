import { Api } from 'services/api'

export interface SagaContext {
  readonly api: Api
}
