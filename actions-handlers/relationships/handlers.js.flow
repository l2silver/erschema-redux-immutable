// @flow
import {OrderedSet, Map, Record} from 'immutable'
import {relationshipTypes} from 'erschema'
const {ONE, MANY} = relationshipTypes
type $modelGenerator = (ent: Object)=>Class<any>
type $location = string[];

const getRelationshipType = (mapOfRelationshipTypes: Object, mapOfRelationshipTypesById?: Object, id: string | number, relationshipName: string)=>{
  if(mapOfRelationshipTypesById){
    return mapOfRelationshipTypesById[id][relationshipName]
  }
  return mapOfRelationshipTypes[relationshipName]
}
export default {
  reorder(mapOfRelationshipTypes: Object, mapOfRelationshipTypesById?: Object) {
    return function (state: Map<string, any>, {payload, error}: Object) {
      if (error) {
        return state
      }
      const { name, id, ordinal, originalOrdinal } = payload.changeRelationshipOrder
      const relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, name)
      if (relationshipType === undefined){
        throw new Error(`Trying to reorder on relationship ${name} that does not exist`)
      }
      return state.updateIn([name, `${id}`], (ids: any) => {
        if(!ids){
          throw new Error(`No relationship ${name} values to reorder on`)
        }
        const idsArray = ids.toArray();
        const value = idsArray[originalOrdinal]
        idsArray.splice(originalOrdinal, 1)
        idsArray.splice(ordinal, 0, value);
        return new OrderedSet(idsArray)
      })
    }
  },
  link(mapOfRelationshipTypes: Object, mapOfRelationshipTypesById?: Object) {
    return function (state: Map<string, any>, {payload, error}: Object) {
      if (error) {
        return state
      }
      const {relationshipName, id, relationshipValue} = payload.relationship
      const relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, relationshipName)
      if (relationshipType === undefined){
        throw new Error(`Trying to link on relationship ${name} that does not exist`)
      }
      if (relationshipType === MANY){
        return state.updateIn([relationshipName, `${id}`], (ids: any) => {
          if(ids){
            return ids.add(relationshipValue)
          }
          return new OrderedSet([relationshipValue])
        })
      }
      return state.setIn([relationshipName, `${id}`], relationshipValue)
    }
  },
  createRelationship(mapOfRelationshipTypes: Object, mapOfRelationshipTypesById?: Object) {
    return function (state: Map<string, any>, {payload, error}: Object) {
      if (error) {
        return state
      }
      const {relationshipName, id, relationshipValue} = payload.relationship
      const relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, relationshipName)
      if (relationshipType === MANY){
        return state.setIn([relationshipName, `${id}`], new OrderedSet([relationshipValue]))
      }
      return state.setIn([relationshipName, `${id}`], relationshipValue)
    }
  },
  concatRelationship(mapOfRelationshipTypes: Object, mapOfRelationshipTypesById?: Object) {
    return function (state: Map<string, any>, {payload, error}: Object) {
      if (error) {
        return state
      }
      const {name, idValuePairs} = payload.relationships
      let relationshipType = mapOfRelationshipTypes[name]
      return state.updateIn([name], relationships=>{
        return idValuePairs.reduce((finalResult, {id, value})=>{
          return finalResult.updateIn([`${id}`], (existingValues)=>{
            if (existingValues) {

              return existingValues.concat(value);
            }
            return new OrderedSet(value);
          })
        }, relationships)
      })
    }
  },
  unlink(mapOfRelationshipTypes: Object, mapOfRelationshipTypesById?: Object) {
    return function (state: Map<string, any>, {payload, error}: Object) {
      if (error) {
        return state
      }
      const {relationshipName, id, relationshipValue} = payload.relationship
      const relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, relationshipName)
      if (relationshipType === MANY){
        return state.updateIn([relationshipName, `${id}`], (ids: any) => {
          if(ids){
            return ids.remove(relationshipValue)
          }
          return new OrderedSet()
        })
      }
      return state.setIn([relationshipName, `${id}`], 0)
    }
  },

  indexRelationship(mapOfRelationshipTypes: Object, mapOfRelationshipTypesById?: Object) {
    return function (state: Map<string, any>, {payload, error}: Object) {
      if (error) {
        return state
      }
      const {name, idValuePairs} = payload.relationships
      let relationshipType = mapOfRelationshipTypes[name]
      return state.updateIn([name], relationships=>{
        return idValuePairs.reduce((finalResult, {id, value})=>{
          if(mapOfRelationshipTypesById){
            relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, name)
          }
          const finalValue = relationshipType === MANY ? new OrderedSet(value) : value
          return finalResult.set(`${id}`, finalValue)
        }, relationships)
      })
    }
  },
  remove(mapOfRelationshipTypes: Object, relationshipNames: string[][], mapOfRelationshipTypesById?: Object) {
    return function (state: Map<string, any>, {payload, error}: Object) {
      if (error) {
        return state
      }
      const {id} = payload
      return relationshipNames.reduce((finalResult, [relationshipName, page])=>{
        const relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, page || id, relationshipName)
        if(page){
          if (relationshipType === MANY){
            return finalResult.updateIn([relationshipName, page], (ids: OrderedSet<number | string>) => {
              return ids && ids.delete(id)
            })
          }
          return finalResult.updateIn([relationshipName, page], (idValue: Map<string, number | string>) => {
            return idValue === id ? 0 : idValue
          })
        }
        if (relationshipType === MANY){
          return finalResult.updateIn([relationshipName], (mapOfIds: Map<string, OrderedSet<number | string>>) => {
            return mapOfIds.map(ids=>ids && ids.delete(id))
          })
        }
        return finalResult.updateIn([relationshipName], (mapOfIds: Map<string, number | string>) => {
          return mapOfIds.map(idValue=>idValue === id ? 0 : idValue)
        })
      }, state)
    }
  },
  
}
