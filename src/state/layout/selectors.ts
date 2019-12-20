import { LayoutState } from './reducer'

export interface ILayoutState {
  readonly layout: LayoutState
}

const getReposPerPage = (state: ILayoutState) => {
  return state.layout.reposPerPage
}

const getPrimaryColor = (state: ILayoutState) => {
  return state.layout.primaryColor
}

export const layoutSelectors = {
  getReposPerPage,
  getPrimaryColor
}
