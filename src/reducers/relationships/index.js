// @flow
import {Map} from 'immutable'
import {handleActions} from 'redux-actions'
import actionNames from 'resource-action-types'
import {relationshipTypes} from 'erschema'
import * as handlers from '../../handlers/relationships'
import generateDefaultState from './generateDefaultState'

import type {$relationshipSchema} from 'erschema/types'

const {ONE, MANY} = relationshipTypes

type $coreProps = {
  entityName: string,
	options?: Object,
  otherActions?: Object,
  locationPath?: string[],
};

type $props = $coreProps & {
  relationshipsSchema: $relationshipSchema[]
};

type $pageProps = $coreProps & {
  relationshipsSchema: {[key: string]: $relationshipSchema[]}
};

function getMapOfRelationshipDefaultValues(relationships, startValue = {}){
  return relationships.reduce((finalResult, { name, entityName }) => {
    finalResult[name || entityName] = new Map({})
    return finalResult
  }, startValue)
}

function getMapOfRelationshipTypes(relationships){
  return relationships.reduce((finalResult, {name, type})=>{
    finalResult[name] = type
    return finalResult
  }, {})
}

function getMapOfRelationships(relationships, startValue = {}, page){
  return relationships.reduce((finalResult: Object, {entityName, name})=>{
    if(!finalResult[entityName]){
      finalResult[entityName] = []
    }
    finalResult[entityName].push(page ? [name, page] : [name])
    return finalResult
  }, startValue)
}

export default function ({entityName, relationshipsSchema = [], otherActions = {}}: $props) {
  const relationships = relationshipsSchema
  const mapOfRelationshipDefaultValues = getMapOfRelationshipDefaultValues(relationships)
  const mapOfRelationshipTypes = getMapOfRelationshipTypes(relationships)
  const mapOfRelationships = getMapOfRelationships(relationships)
  const removeActions = Object.keys(mapOfRelationships).reduce((finalResult, relatedEntityName)=>{
    finalResult[actionNames.remove(relatedEntityName)] = handlers.remove(mapOfRelationshipTypes, mapOfRelationships[relatedEntityName])
    return finalResult
  }, {})
  return handleActions(
    {
      [actionNames.link(entityName)]: handlers.link(mapOfRelationshipTypes),
      [actionNames.unlink(entityName)]: handlers.unlink(mapOfRelationshipTypes),
      [actionNames.createRelationship(entityName)]: handlers.create(mapOfRelationshipTypes),
      [actionNames.concatRelationship(entityName)]: handlers.concat(mapOfRelationshipTypes),
      [actionNames.indexRelationship(entityName)]: handlers.index(mapOfRelationshipTypes),
      [actionNames.reorder(entityName)]: handlers.reorder(mapOfRelationshipTypes),
      ...removeActions,
      ...otherActions
    },
    generateDefaultState(mapOfRelationshipDefaultValues))
}

export function relationshipPageReducer({entityName, relationshipsSchema, otherActions = {}}: $pageProps) {
  const relationships = Object.keys(relationshipsSchema).reduce((finalResult, page)=>{
    finalResult[page] = relationshipsSchema[page] || []
    return finalResult
  }, {})
  const mapOfRelationshipDefaultValues = Object.keys(relationships).reduce((finalResult, page)=>{
    return getMapOfRelationshipDefaultValues(relationships[page], finalResult)
  }, {})
  
  const mapOfRelationshipTypes = Object.keys(relationships).reduce((finalResult, page)=>{
    finalResult[page] = getMapOfRelationshipTypes(relationships[page])
    return finalResult
  }, {})
  const mapOfRelationships = Object.keys(relationships).reduce((finalResult, page)=>{
    return getMapOfRelationships(relationships[page], finalResult, page)
  }, {})
  const removeActions = Object.keys(mapOfRelationships).reduce((finalResult, relatedEntityName)=>{
    finalResult[actionNames.remove(relatedEntityName)] = handlers.remove({}, mapOfRelationships[relatedEntityName], mapOfRelationshipTypes)
    return finalResult
  }, {})
  return handleActions(
    {
      [actionNames.link(entityName)]: handlers.link({}, mapOfRelationshipTypes),
      [actionNames.unlink(entityName)]: handlers.unlink({}, mapOfRelationshipTypes),
      [actionNames.createRelationship(entityName)]: handlers.create({}, mapOfRelationshipTypes),
      [actionNames.concatRelationship(entityName)]: handlers.concat({}, mapOfRelationshipTypes),
      [actionNames.indexRelationship(entityName)]: handlers.index({}, mapOfRelationshipTypes),
      ...removeActions,
      ...otherActions
    },
    generateDefaultState(mapOfRelationshipDefaultValues))
}