import { UserState } from './reducer'

interface IUserState {
  user: UserState
}

export function getUserData(state: IUserState) {
  return state.user.data
}

export function getUserIsFetching(state: IUserState) {
  return state.user.isFetching
}

export function getUserError(state: IUserState) {
  return state.user.error
}

export const userSelectors = {
  getUserData,
  getUserIsFetching,
  getUserError
}
