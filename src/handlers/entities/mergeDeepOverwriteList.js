// @flow
import {List} from 'immutable'
export default function mergeDeepOverwriteList (prev: any, next: any) {
  if (typeof next === 'object') {
    if (List.isList(prev)) {
      return new List(next)
    }
    else {
      if (prev && typeof prev === 'object' && prev.mergeWith) {
        return prev.mergeWith(mergeDeepOverwriteList, next)
      }
      return next
    }
  }
  return next
}
