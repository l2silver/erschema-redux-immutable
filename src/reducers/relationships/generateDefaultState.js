// @flow
import {Record} from 'immutable'
export default function generateDefaultState(defaultPropsConfig: Object = {}){
  const DefaultState = Record({
    ...defaultPropsConfig
  })
  const defaultState = new DefaultState()
  return defaultState
}
