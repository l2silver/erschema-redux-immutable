// @flow
import mergeDeepOverwriteList from './mergeDeepOverwriteList'
type $modelGenerator = (ent: Object)=>Class<any>
type $location = string[];

export function create(modelGenerator: $modelGenerator, location: $location = []) {
  return function (state: Object, {payload, error}: Object) {
    if (error) {
      return state
    }
    const Model = modelGenerator(payload.entity)
    const entity = new Model(payload.entity)
    const nextState = state.setIn(location.concat([`${payload.entity.id}`]), entity)
    return nextState
  }
}

export function remove(location: $location = []){
  return function (state: Object, {payload, error}: Object) {
    if (error) {
      return state
    }
    return state.deleteIn(location.concat([`${payload.id}`]))
  }
}

export function update(location: $location = []){
  return function (state: Object, {payload, error}: Object) {
    if (error) {
      return state
    }
    const {id, ...otherProps} = payload.entity
    return state.mergeIn(location.concat([`${id}`]), otherProps)
  }
}
export function get(modelGenerator: $modelGenerator, location: $location = []) {
  return function (state: Object, {payload, error}: Object) {
    if (error) {
      return state
    }
    return state.updateIn(location.concat([`${payload.entity.id}`]), previousEntity => {
      if (previousEntity) {
        return previousEntity.mergeWith(mergeDeepOverwriteList, payload.entity)
      }
      return new (modelGenerator(payload.entity))(payload.entity)
    })
  }
}

export function index(modelGenerator: $modelGenerator, location: $location = []) {
  return function (state: Object, {payload, error}: Object) {
    if (error) {
      return state
    }
    return payload.entities.reduce((finalResult, entity) => {
      return finalResult.updateIn(location.concat([`${entity.id}`]), previousEntity => {
        if (previousEntity) {
          return previousEntity.mergeWith(mergeDeepOverwriteList, entity)
        }
        const Model = modelGenerator(entity)
        return new Model(entity)
      })
    }, state)
  }
}
