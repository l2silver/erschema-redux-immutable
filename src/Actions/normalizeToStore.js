// @flow
import normalize from 'erschema'
import {batchActions} from 'redux-batched-actions'
import {get} from 'lodash';
import {entityActions, relationshipActions} from '../actions-handlers'


import type {$schemaWithRelationshipsArray, $entitySchemaWithRelationshipsArray} from 'erschema/types'


export default function normalizeToStore(entity: Object, name: string, schema: $schemaWithRelationshipsArray, firstSchema?: $entitySchemaWithRelationshipsArray, options?: Object = {}){
  const {entities: allEntities, relationships: allRelationships} = normalize(entity, name, schema, firstSchema)
  const entitiesForStore = Object.keys(allEntities).reduce((finalResult, entityName)=>{
    const entities = allEntities[entityName]
    const entitiesForIndex = Object.keys(entities).reduce((finalResult, entityId)=>{
      finalResult.push(entities[entityId])
      return finalResult
    }, [])
    finalResult.push(entityActions.index(entityName, entitiesForIndex))
    return finalResult
  }, [])
  const relationshipsForStore = Object.keys(allRelationships).reduce((allRelationshipActions, entityName)=>{
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
  return batchActions([...entitiesForStore, ...relationshipsForStore])
}

export function indexNormalizeToStore(entities: Object[], name: string, schema: $schemaWithRelationshipsArray, firstSchema?: $entitySchemaWithRelationshipsArray, options?: {}){
  return batchActions(
    entities.map((entity)=>{
      return normalizeToStore(entity, name, schema, firstSchema)
    })
  )
}