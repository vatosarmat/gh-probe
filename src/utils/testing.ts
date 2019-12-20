import { inspect, isDeepStrictEqual } from 'util'

expect.extend({
  toIncludeAllMembersOrdered(received: any[], members: any[]) {
    const opts = {
      depth: 4
    }

    if (received.length < members.length) {
      return {
        pass: false,
        message: () => `'received' is shorter than 'members'\n${inspect(members, opts)}\n${inspect(received, opts)}`
      }
    }

    let n = 0
    for (let i = 0; i < received.length && n < members.length; i++) {
      if (isDeepStrictEqual(received[i], members[n])) {
        n++
      }
    }

    if (n === members.length) {
      return {
        pass: true,
        message: () =>
          `${inspect(members, opts)}\n` +
          `\nunexpectedly found in 'received':\n` +
          `---------------------------------------------------\n` +
          `${inspect(received, opts)}`
      }
    } else {
      return {
        pass: false,
        message: () =>
          `${inspect(members[n], opts)}\n` +
          `\nnot found in 'received':\n` +
          `---------------------------------------------------\n` +
          `${inspect(received, opts)}`
      }
    }
  }
})

type AsyncPair<V> = [(...args: any) => Promise<V>, V]

export function mockAndResolve<V>(delay: number = 5) {
  return function<T extends AsyncPair<V>[]>(...pairs: T) {
    const resolves: [Function, V][] = []

    function resolveIfReady() {
      if (resolves.length === pairs.length) {
        for (const [resolve, value] of resolves) {
          setTimeout(() => {
            resolve(value)
          }, delay)
        }
      }
    }

    for (const [func, value] of pairs) {
      ;((func as unknown) as jest.Mock).mockImplementationOnce(() => {
        return new Promise(resolve => {
          resolves.push([resolve, value])
          resolveIfReady()
        })
      })
    }
  }
}

declare global {
  //eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toIncludeAllMembersOrdered(members: any[]): R
    }
  }
}