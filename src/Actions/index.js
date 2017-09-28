// @flow
import {createAction} from 'redux-actions'
import {retypeAction} from 'redux-retype-actions'
import resourceActions, {generateActionName as actionifyName} from 'resource-action-types'
import {entityActions, relationshipActions} from '../actions-handlers'
import normalizeToStore, {indexNormalizeToStore} from './normalizeToStore'
import type {$schema} from 'erschema/types'

type $$id = string | number

const getRelatedName = (name)=>`GET_RELATED_${actionifyName(name)}`;
const concatRelatedName = (name)=>`CONCAT_RELATED_${actionifyName(name)}`;

export default class Actions {
  entities: {
    create: (ent: Object) => any,
    update: (ent: Object) => any,
    remove: (id: $$id) => any,
    get: (ent: Object) => any,
    index: (ents: Object[]) => any,
    getRelated: (id: $$id, relationshipName: string, ents: Object[]) => any,
    getAdditionalEntityProperties: (id: $$id, entityName: string, entity: Object) => any,
    concatRelated: (id: $$id, relationshipName: string, ents: Object[]) => any,
  };
  relationships: Object;
  name: string;
  constructor (schema: $schema, name: string) {
    this.name = name
    this.entities = {
      create: (entity) => entityActions.create(name, entity),
      update: (entity) => entityActions.update(name, entity),
      remove: (id) => entityActions.remove(name, id),
      get: (entity) => retypeAction(resourceActions.get(name), normalizeToStore(entity, name, schema)),
      index: (entities) => retypeAction(resourceActions.index(name), indexNormalizeToStore(entities, name, schema)),
      getRelated: (id, relationshipName, entities) => {
        if (entities instanceof Error) {
          return retypeAction(getRelatedName(name), entityActions.get(name, entities))
        }
        return retypeAction(getRelatedName(name), normalizeToStore({id, [relationshipName]: entities}, name, schema))
      },
      getAdditionalEntityProperties: (id, entityName, entity) => {
        if (entity instanceof Error) {
          return entityActions.get(entityName, entity)
        }
        return retypeAction(`GET_ADDITIONAL_ENTITY_PROPERTIES_${actionifyName(name)}`, normalizeToStore({id, ...entity}, name, schema))
      },
      concatRelated: (id, relationshipName, entities) => {
        if (entities instanceof Error) {
          return entityActions.get(name, entities)
        }
        return retypeAction(
          `${concatRelatedName(name)}_${actionifyName(name)}`,
          normalizeToStore({id, [relationshipName]: entities}, name, schema, undefined,
          {
            relationships: {
              [name]: {
                [relationshipName]: {
                  concat: true
                }
              }
            }
          }))
      }
    }
  }
  createAction (name: string, payload: Object) {
    return createAction(name)(payload)
  }
}

export class PageActions {
  entities: {
    create: (ent: Object) => any,
    update: (ent: Object) => any,
    remove: () => any,
    get: (ent: Object) => any,
    getRelated: (relationshipName: string, ents: Object[]) => any,
    concatRelated: (relationshipName: string, ents: Object[]) => any,
  };
  constructor (schema: $schema, firstSchema: $schema, name: string) {
    this.entities = {
      create: (entity) => entityActions.create('pages', {...entity, id: name}),
      update: (entity) => entityActions.update('pages', {...entity, id: name}),
      remove: () => entityActions.remove('pages', name),
      get: (entity) => retypeAction(
        `${resourceActions.get('pages')}_${actionifyName(name)}`,
        normalizeToStore(entity, 'pages', schema, firstSchema[name])
      ),
      getRelated: (relationshipName, entities) => {
        if (entities instanceof Error) {
          return entityActions.get(name, entities)
        }
        return retypeAction(
          `${getRelatedName(name)}_${actionifyName(relationshipName)}`,
          normalizeToStore({[relationshipName]: entities}, 'pages', schema, firstSchema[name]))
      },
      concatRelated: (relationshipName, entities) => {
        if (entities instanceof Error) {
          return entityActions.get(name, entities)
        }
        return retypeAction(
          `${concatRelatedName(name)}_${actionifyName(name)}`,
          normalizeToStore({[relationshipName]: entities}, 'pages', schema, firstSchema[name],
          {
            relationships: {
              [name]: {
                [relationshipName]: {
                  concat: true
                }
              }
            }
          }))
      }
    }
  }
  createAction (name: string, payload: Object) {
    return createAction(name)(payload)
  }
}
