// @flow
import normalize from 'erschema';
import {batchActions} from 'redux-batched-actions';
import {retypeAction} from 'redux-retype-actions';
import {get} from 'lodash';
import {generateActionName} from 'resource-action-types';
import entityActions from '../entities'
import relationshipActions from '../relationships'


import type {$schema} from 'erschema/types';

export function normalizeActions(entity: Object, name: string, schema: $schema, firstSchema?: $schema, options?: Object = {}){
  const {entities: allEntities, relationships: allRelationships} = normalize(entity, name, schema, firstSchema)
  const indexEntities = Object.keys(allEntities).reduce((finalResult, entityName)=>{
    const entities = allEntities[entityName]
    const entitiesForIndex = Object.keys(entities).reduce((finalResult, entityId)=>{
      finalResult.push(entities[entityId])
      return finalResult
    }, [])
    finalResult.push(entityActions.index(entityName, entitiesForIndex))
    return finalResult
  }, [])
  const indexRelationships = Object.keys(allRelationships).reduce((allRelationshipActions, entityName)=>{
    const relationships = allRelationships[entityName]
    const relationshipsForIndex = Object.keys(relationships).reduce((finalResult, relationshipName)=>{
      const relationship = relationships[relationshipName]
      const idValuePairs = Object.keys(relationship).reduce((finalResult, entityId)=>{
        finalResult.push({id: entityId, value: relationship[entityId]})
        return finalResult
      }, [])
      
      const relationshipActionName = get(options, `relationships.${entityName === 'pages' ? idValuePairs[0].id : entityName}.${relationshipName}.concat`) ? 'concatRelationship' : 'index'
      finalResult.push(relationshipActions[relationshipActionName](entityName, {name: relationshipName, idValuePairs}))
      return finalResult
    }, allRelationshipActions)
    return allRelationshipActions
  }, [])
  return {
    indexEntities,
    indexRelationships
  }
}

export function indexNormalizeActions(entities: Object[], name: string, schema: $schema, firstSchema?: $schema, options?: {}){
  return entities.map((entity)=>{
    return normalizeActions(entity, name, schema, firstSchema, options)
  })
}