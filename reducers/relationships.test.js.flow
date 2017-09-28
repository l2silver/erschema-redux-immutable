// @flow
import * as Immutable from 'immutable'
import relationshipReducer from './reducer'
import actions from './actions'
import {relationshipTypes} from 'erschema'
const {MANY, ONE} = relationshipTypes

const getId = ()=>Math.round((Math.random() * 1000000))
const {Record, Map, OrderedSet} = Immutable

describe('entityReducer', function () {
  const name = 'users'
  const relationshipsSchema = {
    manyRelationships: {
      friends: [{
        name: 'people'
      }]
    },
    monoRelationships: {
      friend: [{
        name: 'people'
      }]
    }
  }
  
  function getDefaultState (initialState = {}) {
    return new (Record({friend: new Map(), friends: new Map(initialState)}))()
  }
  it('returns default state', function () {
    const defaultState = getDefaultState()
    const usersReducer = relationshipReducer({name, relationshipsSchema})
    expect(usersReducer(undefined, {type: 1}).toObject()).toEqual(defaultState.toObject())
  })
  it('returns default state with config', function () {
    const defaultState = new (Record({friend: new Map(), friends: new Map(), otherData: new Map()}))()
    const usersReducer = relationshipReducer({name, relationshipsSchema, defaultStateConfig: {otherData: new Map()}})
    expect(usersReducer(undefined, {type: 1}).toObject()).toEqual(defaultState.toObject())
  })
  describe('actions', function () {
    const usersReducer = relationshipReducer({name, relationshipsSchema})
    const friendId = getId()
    it('creates Single', function () {
      const id = getId()  
      expect(usersReducer(undefined, actions.link(name, {relationshipName: 'friend', id, relationshipValue: friendId})).friend).toEqual(new Map({[id]: friendId}))
    })
    it('creates Multi', function () {
      const id = getId()  
      expect(usersReducer(undefined, actions.link(name, {relationshipName: 'friends', id, relationshipValue: friendId})).friends).toEqual(new Map({[id]: OrderedSet([friendId])}))
    })
    it('reorder', function () {
      const id = getId()
      const initialState = getDefaultState({
        [id]: new OrderedSet([0, 1, 2])
      })
      const finalState = getDefaultState({
        [id]: new OrderedSet([1, 0, 2])
      })
      expect(usersReducer(initialState, actions.reorder(name, {name: 'friends', id, ordinal: 2, originalOrdinal: 0})).friends).toEqual(new Map({[id]: OrderedSet([1, 2, 0])}))
    })
  })
})
