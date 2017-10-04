// @flow
import { Map } from 'immutable'
import reduxOverlord from 'redux-overlord'
import {combineReducers} from 'redux'
import reduxComposeHors from 'redux-compose-hors';
import { enableBatching } from 'redux-batched-actions';
import { enableRetyping } from 'redux-retype-actions';
import entityReducer from './entities'
import relationshipReducer, {relationshipPageReducer} from './relationships'
import hor from './hor'
import type {$schema} from 'erschema/types'
import type {$mapOf, $reducer} from './hor'

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

export default function({schema, entities = {}, relationships = {}, overlordActions = {}, pageSchema, pageOtherActionHandlers}: $input){
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
    pageRelationship.pages = relationships.pages || relationshipPageReducer({name: 'pages', relationshipsSchema: getPageRelationships(pageSchema)})
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
      name: schemaName,
      relationshipsSchema: relationshipSchemas
    })
    return finalResult
  }, pageRelationship)
  const entityRelationshipReducers = combineReducers({
    entities: combineReducers(entityReducers),
    relationships: combineReducers(relationshipReducers),
  })
  return reduxComposeHors(reduxOverlord(entityRelationshipReducers, hor(overlordActions)), enableBatching, enableRetyping)
}
