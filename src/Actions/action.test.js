// @flow
jest.mock('redux-batched-actions', ()=>({batchActions: (action)=>action}))
jest.mock('redux-retype-actions', ()=>({retypeAction: (name, action)=>action}))
jest.mock('erschema-action-handlers', ()=>({
  entityActions: {
    index: (entityName, entities)=>({entityName, entities})
  },
  relationshipActions: {
    index: (entityName, relationships)=>({entityName, relationships})
  }
}))
import Actions from './'
import {standardizeEntity} from 'erschema'

const getId = ()=>Math.floor((Math.random()*100000))
describe('Action', function() {
  const schema = {
    users: standardizeEntity({
      Model: class {},
      properties: ['name', 'id'],
      relationships: {
        manyRelationships: {
          friends: [{}]
        },
        monoRelationships: {
        },
      },
    }),
    friends: standardizeEntity({
      Model: class {},
      properties: ['name', 'id']
    })
  };
  class ActionWithSchema extends Actions {
    constructor(name){
      super(schema, name)
    }
  }
  const action = new ActionWithSchema('users')
  describe('creates an action instance with access to', function(){
    it('get', function() {
      const entity = {id: 1, name: 'John'}
      const results = action.actions.get({...entity, friends: []})
      expect(results).toMatchSnapshot()
    })
  })
})