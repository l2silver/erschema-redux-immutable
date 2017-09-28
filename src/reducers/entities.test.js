// @flow
import {Record, Map} from 'immutable'
import createReducer from './reducer'
import actions from './actions'

const getId = ()=>Math.round((Math.random() * 1000000))
describe('reducer', function () {
  const name = 'users'
  const UserModel = class extends Record({id: 0, fullName: ''}) {}
  function getDefaultState (initialState = {}) {
    return new (Record({data: new Map(initialState)}))()
  }
  it('returns default state', function () {
    const defaultState = getDefaultState()
    const userReducer = createReducer({name, Model: UserModel})
    const result = userReducer(undefined, {type: 1})
    expect(result.toObject()).toEqual(defaultState.toObject())
  })
  it('returns default state with config', function () {
    const defaultState = new (Record({data: new Map(), otherData: new Map()}))()
    const userReducer = createReducer({name, Model: UserModel, defaultStateConfig: {otherData: new Map()}})
    expect(userReducer(undefined, {type: 1}).toObject()).toEqual(defaultState.toObject())
  })
  describe('actions', function () {
    const userReducer = createReducer({name, Model: UserModel})
    it('creates', function () {
      const id = getId()
      const patient = new UserModel({id})
      const createAction = actions.create(name, {id})
      const data = userReducer(undefined, createAction).data
      expect(data).toEqual(new Map({[id]: patient}))
    })
    it('updates', function () {
      const id = getId()
      expect(userReducer(getDefaultState({[id]: new UserModel({id})}), actions.update(name, {id, fullName: 'John'})).data).toEqual(new Map({[id]: new UserModel({id, fullName: 'John'})}))
    })
    it('removes', function () {
      const id = getId()
      expect(userReducer(getDefaultState({[id]: new UserModel({id})}), actions.remove(name, id)).data).toEqual(new Map())
    })
    it('gets', function () {
      const id = getId()
      expect(userReducer(getDefaultState(), actions.get(name, {id})).data).toEqual(new Map({[id]: new UserModel({id})}))
    })
    it('indexes', function () {
      const id = getId()
      expect(userReducer(getDefaultState(), actions.index(name, [{id}])).data).toEqual(new Map({[id]: new UserModel({id})}))
    })
  })
})
