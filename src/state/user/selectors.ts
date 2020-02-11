import { UserState } from './reducer'

interface IUserState {
  user: UserState
}

export function getUserQuery(state: IUserState) {
  return state.user.query
}

export function getUserData(state: IUserState) {
  return state.user.data
}

export function isUserDataFetching(state: IUserState) {
  return state.user.isFetching
}

export function getUserError(state: IUserState) {
  return state.user.error
}

export const userSelectors = {
  getUserQuery,
  getUserData,
  isUserDataFetching,
  getUserError
}
