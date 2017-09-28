// @flow
import {Map} from 'immutable'
import {handleActions} from 'redux-actions'
import actionNames from 'resource-action-types'
import {relationshipTypes} from 'erschema'
import handlers from '../actions-handlers/relationships/handlers'
import generateDefaultState from './generateDefaultState'

import type {$relationshipSchema} from 'erschema/types'

const {ONE, MANY} = relationshipTypes

type $coreProps = {
  name: string,
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
  return relationships.reduce((finalResult, {name}) => {
    finalResult[name] = new Map({})
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

export default function ({name, relationshipsSchema = [], otherActions = {}}: $props) {
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
      [actionNames.link(name)]: handlers.link(mapOfRelationshipTypes),
      [actionNames.unlink(name)]: handlers.unlink(mapOfRelationshipTypes),
      [actionNames.createRelationship(name)]: handlers.createRelationship(mapOfRelationshipTypes),
      [actionNames.concatRelationship(name)]: handlers.concatRelationship(mapOfRelationshipTypes),
      [actionNames.indexRelationship(name)]: handlers.indexRelationship(mapOfRelationshipTypes),
      [actionNames.reorder(name)]: handlers.reorder(mapOfRelationshipTypes),
      ...removeActions,
      ...otherActions
    },
    generateDefaultState(mapOfRelationshipDefaultValues))
}

export function relationshipPageReducer({name, relationshipsSchema, otherActions = {}}: $pageProps) {
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
      [actionNames.link(name)]: handlers.link({}, mapOfRelationshipTypes),
      [actionNames.unlink(name)]: handlers.unlink({}, mapOfRelationshipTypes),
      [actionNames.createRelationship(name)]: handlers.createRelationship({}, mapOfRelationshipTypes),
      [actionNames.concatRelationship(name)]: handlers.concatRelationship({}, mapOfRelationshipTypes),
      [actionNames.indexRelationship(name)]: handlers.indexRelationship({}, mapOfRelationshipTypes),
      ...removeActions,
      ...otherActions
    },
    generateDefaultState(mapOfRelationshipDefaultValues))
}