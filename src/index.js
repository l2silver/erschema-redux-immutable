// @flow
import { Map } from 'immutable'
import {combineReducers} from 'redux'
import entityReducer from './reducers/entities'
import relationshipReducer, {relationshipPageReducer} from './reducers/relationships'

import type {$schema} from 'erschema/types'

type $mapOf<X> = {[key: string]: X}
type $reducer = (state: any, action: Object)=>any;

type $input = {
  schema: $schema,
  entities?: $mapOf<$mapOf<$reducer>>,
  relationships?: $mapOf<$mapOf<$reducer>>,
  overlordActions?: $mapOf<$reducer>,
  pageSchema?: $schema,
  pageOtherActionHandlers?: $mapOf<$reducer>,
};

const getPageRelationships = function getPageRelationships(pageSchema: $schema){
  return Object.keys(pageSchema).reduce((finalResult, pageName)=>{
    finalResult[pageName] = pageSchema[pageName].relationships
    return finalResult
  }, {})
}

const getPageModelGenerator = function(schema: $schema){
  return function(entity){
    return schema[entity.id].Model
  }
}

export default function({schema, entities = {}, relationships = {}, pageSchema, pageOtherActionHandlers}: $input){
  const pageEntity = {}
  const pageRelationship = {}
  if(pageSchema){
    pageEntity.pages = entities.pages || entityReducer({
      name: 'pages',
      modelGenerator: getPageModelGenerator(pageSchema),
      otherActions: pageOtherActionHandlers,
      defaultStateConfig: Object.keys(pageSchema).reduce((finalResult, key)=>{
          finalResult[key] = new pageSchema[key].Model();
          return finalResult;
        }, {})
    })
    pageRelationship.pages = relationships.pages || relationshipPageReducer({entityName: 'pages', relationshipsSchema: getPageRelationships(pageSchema)})
  }
  const entityReducers = Object.keys(schema).reduce((finalResult, schemaName)=>{
    const entitySchema = schema[schemaName]
    finalResult[schemaName] = entities[schemaName] || entityReducer({
      name: schemaName,
      Model: entitySchema.Model
    })
    return finalResult
  }, pageEntity)
  const relationshipReducers = Object.keys(schema).reduce((finalResult, schemaName)=>{
    const entitySchema = schema[schemaName]
    const {relationships: relationshipSchemas} = entitySchema
    finalResult[schemaName] = relationships[schemaName] || relationshipReducer({
      entityName: schemaName,
      relationshipsSchema: relationshipSchemas || [],
    })
    return finalResult
  }, pageRelationship)
  return combineReducers({
    entities: combineReducers(entityReducers),
    relationships: combineReducers(relationshipReducers),
  })
}
