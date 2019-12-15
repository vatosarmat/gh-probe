export type ReposFetchStatus = 'IDLE' | 'IN_PROGRESS' | 'ABORTED' | 'ERROR' | 'FULL'

export interface ReposFetchProgress {
  readonly current: number
  readonly total: number
}
