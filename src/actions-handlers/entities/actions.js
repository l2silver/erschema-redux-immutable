// @flow
import {createAction} from 'redux-actions'
import actionNames from 'resource-action-types'
export default {
  create(entityName: string, entity: Object | Error) {
    if (entity instanceof Error) {
      return createAction(actionNames.create(entityName))(entity)
    }
    return createAction(actionNames.create(entityName))({entity})
  },
  update(entityName: string, entity: Object | Error) {
    if (entity instanceof Error) {
      return createAction(actionNames.update(entityName))(entity)
    }
    return createAction(actionNames.update(entityName))({entity})
  },
  remove(entityName: string, entityId: string | number | Error) {
    if (entityId instanceof Error) {
      return createAction(actionNames.remove(entityName))(entityId)
    }
    return createAction(actionNames.remove(entityName))({id: entityId})
  },
  get(entityName: string, entity: Object | Error) {
    if (entity instanceof Error) {
      return createAction(actionNames.get(entityName))(entity)
    }
    return createAction(actionNames.get(entityName))({entity})
  },
  index(entityName: string, entities: Object[] | Error) {
    if (entities instanceof Error) {
      return createAction(actionNames.index(entityName))(entities)
    }
    return createAction(actionNames.index(entityName))({entities})
  }
}
