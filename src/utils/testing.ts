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

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toIncludeAllMembersOrdered(members: any[]): R
    }
  }
}
