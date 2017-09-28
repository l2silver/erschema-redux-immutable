// @flow
import reducer from './reducer'
import {standardizeEntity} from 'erschema'

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
    expect(basicReducer(undefined, {}).entities.users.toJS()).toEqual({data: {}})
    expect(basicReducer(undefined, {}).relationships.users.toJS()).toEqual({})
  })
})