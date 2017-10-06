// @flow

import normalize from './'

describe('normalize', ()=>{
  it('return an object with indexRelations and indexEntities', ()=>{
    const schema = {
      users: {

      }
    }
    const user = {
      id: 1,
      name: 'Jimmy'
    }
    expect(normalize(user, 'users', schema)).toMatchSnapshot()
  })
})