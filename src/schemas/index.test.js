// @flow
import standardizeEntity from './'

describe('schemas', () => {
  it('standardizeEntity', () => {
    const Model = class {}
    const properties = {
      name: ''
    }
    const entity = standardizeEntity({
      Model,
      properties,
      modifier: (ent)=>{
        ent.name = ent.name.toUpperCase();
        return ent
      }
    })
    expect(entity.modifier({
      name: 'jerry',
      age: 17
    })).toEqual({
      name: 'JERRY',
    })
  })
})