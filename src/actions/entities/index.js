// @flow
import actionNames from 'resource-action-types'

export function create(entityName: string, entity: Object, error?: boolean) {
  return {
    type: actionNames.create(entityName),
    payload: {
      entity
    },
    error,
  };
}
export function update(entityName: string, entity: Object, error?: boolean) {
  return {
    type: actionNames.update(entityName),
    payload: {
      entity
    },
    error,
  };
}
export function remove(entityName: string, id: string | number, error?: boolean) {
  return {
    type: actionNames.remove(entityName),
    payload: {
      id,
    },
    error,
  };
}
export function get(entityName: string, entity: Object, error?: boolean) {
  return {
    type: actionNames.get(entityName),
    payload: {
      entity,
    },
    error,
  };
}
export function index(entityName: string, entities: Object[], error?: boolean) {
  return {
    type: actionNames.index(entityName),
    payload: {
      entities,
    },
    error,
  };
}
