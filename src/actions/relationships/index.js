// @flow
import {createAction} from 'redux-actions'
import actionNames from 'resource-action-types'

type $id = string | number;
type $relationship = {
  relationshipName: string,
  id: $id,
  relationshipValue: $id | $id[]
};

type $relationships = {
  name: string;
  idValuePairs: Array<{id: $id, value: $id | $id[]}>;
};

type $changeRelationshipOrder = {
  name: string,
  id: $id,
  originalOrdinal: number,
  ordinal: number,
}

export function link(entityName: string, relationship: $relationship, error?: boolean) {
  return {
    type: actionNames.link(entityName),
    payload: {
      relationship,
    },
    error,
  }
}
export function unlink(entityName: string, relationship: $relationship, error?: boolean) {
  return {
    type: actionNames.unlink(entityName),
    payload: {
      relationship,
    },
    error,
  }
}
export function index(entityName: string, relationships: $relationships, error?: boolean) {
  return {
    type: actionNames.indexRelationship(entityName),
    payload: {
      relationships,
    },
    error,
  }
}
export function create(entityName: string, relationship: $relationship, error?: boolean) {
  return {
    type: actionNames.createRelationship(entityName),
    payload: {
      relationship,
    },
    error,
  }
}
export function concat(entityName: string, relationships: $relationships, error?: boolean) {
  return {
    type: actionNames.concatRelationship(entityName),
    payload: {
      relationships,
    },
    error,
  }
}
export function reorder(entityName: string, changeRelationshipOrder: $changeRelationshipOrder, error?: boolean) {
  return {
    type: actionNames.reorder(entityName),
    payload: {
      changeRelationshipOrder,
    },
    error,
  }
}
