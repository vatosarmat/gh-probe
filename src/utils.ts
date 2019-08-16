import { Store } from 'redux'

export async function waitForState<State>(store: Store) {
  return new Promise<State>(resolve => {
    const unsubscribe = store.subscribe(() => {
      resolve(store.getState())
      unsubscribe()
    })
  })
}
