// @flow
import * as Immutable from 'immutable'
import relationshipReducer from './'
import * as actions from '../../actions/relationships'
import {relationshipTypes} from 'erschema'
const {MANY, ONE} = relationshipTypes

const getId = ()=>Math.round((Math.random() * 1000000))
const {Record, Map, OrderedSet} = Immutable

describe('relationshipsReducer', function () {
  const name = 'users'
  const relationshipsSchema = [
    {
      name: 'friends',
      entityName: 'people',
      type: relationshipTypes.MANY,
    },
    {
      name: 'friend',
      entityName: 'people',
      type: relationshipTypes.ONE,
    }
  ]
  
  function getDefaultState (initialState = {}) {
    return new (Record({friend: new Map(), friends: new Map(initialState)}))()
  }
  it('returns default state', function () {
    const defaultState = getDefaultState()
    const usersReducer = relationshipReducer({name, relationshipsSchema})
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
