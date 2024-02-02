export function isSymbol(value: any): value is symbol {
  return typeof value === 'symbol'
}
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}
