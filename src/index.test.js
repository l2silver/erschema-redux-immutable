// @flow
import {Map} from 'immutable'
import reducer from './'
import standardizeEntity from '../schemas'

describe('reducer', function () {
  class Model {

  }
  it('returns basic reducer', function () {
    const basicReducer = reducer({schema: {}})
    expect(basicReducer(undefined, {})).toEqual({entities: {}, relationships: {}})
  })
  it('returns with one entity', function () {
    const schema = {
      users: standardizeEntity({properties: ['name'], Model})
    }
    const basicReducer = reducer({schema})
    expect(basicReducer(undefined, {}).entities.users).toEqual(new Map())
    expect(basicReducer(undefined, {}).relationships.users.toJS()).toEqual({})
  })
})