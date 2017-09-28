// @flow
import {Map, OrderedSet, Record, List} from 'immutable'
import Chance from 'chance'
import Selectors from './Selectors'

class PatientModel extends Record({id: 0}) {}

const chance = new Chance()
describe('selectorUtils', function () {
  describe('Selector', function () {
    const selector = new Selectors('erschema', 'patients', new PatientModel())
    const patient1 = new PatientModel({id: chance.natural()})
    const patient2 = new PatientModel({id: chance.natural()})
    const patient3 = new PatientModel({id: chance.natural()})
    const woundId = chance.natural()
    const state = {
      erschema: {
        entities: {
          patients: new (Record({data: new Map()}))({
            data: new Map({
              [patient1.id]: patient1,
              [patient2.id]: patient2,
              [patient3.id]: patient3
            })
          })
        },
        relationships: {
          patients: new Map({
            wounds: new Map({
              [patient1.id]: new OrderedSet([woundId])
            }),
            wound: new Map({
              [patient1.id]: woundId
            })
          })
        }
      }
    }
    it('findEntity', function () {
      expect(selector.findEntity()(state, {id: patient1.id})).toBe(patient1)
    })
    it('findEntity returns default', function () {
      expect(selector.findEntity()(state, {id: 0})).toEqual(new PatientModel())
    })
    it('getEntities', function () {
      expect(selector.getEntities(() => new List([patient1.id, patient2.id]))(state, {})).toEqual(new List([patient1, patient2]))
    })
    it('getEntities return default', function () {
      expect(selector.getEntities(() => new List([0, -1]))(state, {})).toEqual(new List([new PatientModel(), new PatientModel()]))
    })
    it('getEntityData', function () {
      expect(selector.getEntityData()(state, {})).toBe(state.erschema.entities.patients.get('data'))
    })
    it('getRelatedEntityIds', function () {
      // $FlowFixMe
      expect(selector.getRelatedEntityIds('wounds', () => patient1.id)(state)).toEqual(new List([woundId]))
    })
    it('getRelatedEntityIds returns default', function () {
      // $FlowFixMe
      expect(selector.getRelatedEntityIds('wounds', () => patient2.id)(state)).toEqual(new List())
    })
    it('findRelatedEntityId', function () {
      expect(selector.findRelatedEntityId('wound', () => patient1.id)(state, {})).toEqual(woundId)
    })
    it('findRelatedEntityId returns default', function () {
      expect(selector.findRelatedEntityId('wound', () => patient2.id)(state, {})).toEqual(0)
    })
  })
})
