import { Store } from 'redux'

export async function waitForStateChange<State>(store: Store): Promise<State> {
  return new Promise<State>(resolve => {
    const unsubscribe = store.subscribe(() => {
      resolve(store.getState())
      unsubscribe()
    })
  })
}
