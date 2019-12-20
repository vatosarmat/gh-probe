export function isFunction(f: any): f is Function {
  return f instanceof Function
}

export function isError(e: any): e is Error {
  return e instanceof Error
}

export function isNumber(n: any): n is number {
  return typeof n === 'number'
}

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U>
    ? Mutable<U>[]
    : T[P] extends (...args: any) => any
    ? T[P]
    : Mutable<T[P]>
}
