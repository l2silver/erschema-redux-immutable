// @flow
import {Map, OrderedSet, List} from 'immutable'
import {createSelector} from 'reselect'
const defaultMap = new Map()
const defaultOrderedSet = new OrderedSet()

type $$state = Object;
type $$props = Object;

type $$selector<X> = (state: $$state, props: $$props) => X;

type $$idSelector = $$selector<number | string>;
type $$idsSelector = $$selector<$Iterable<number, *, *>>;
type $$selectorExact<X> = $$selector<$Exact<X>>;
type $$id = number | string;

const bindMethods = function(klass, ...methodNames){
  methodNames.forEach((methodName)=>{
    //$FlowFixMe
    klass[methodName] = klass[methodName].bind(klass)
  })
}

const defaultIdSelector = function (state: Object, props: Object) {
  if (props && props.id) {
    return props.id
  }
  return 0
}

export default class Selector <X> {
  name: string;
  erschemaReducerName: string;
  defaultModel: X;
  constructor (erschemaReducerName: string, name: string, model: X) {
    this.erschemaReducerName = erschemaReducerName
    this.name = name
    this.defaultModel = model
    bindMethods(
      this,
      'findEntityData',
      'get',
      'find',
      'getRelatedIds',
      'findRelatedId',
      'getRawRelatedIds',
      'findMonoRelationshipData',
      'findManyRelationshipData',
    )
  }
  findEntityData () : $$selector<Map<string, X>> {
    return createSelector(
      [
        (state) => state[this.erschemaReducerName].entities[this.name]
      ],
      (entities: Map<string, X>) => entities
    )
  }
  findManyRelationshipData (relationshipName: string) : $$selector<Map<string, X>> {
    return createSelector(
      [
        (state) => state[this.erschemaReducerName].relationships[this.name][relationshipName]
      ],
      (relationships: Map<string, OrderedSet<$$id>>) => (relationships || defaultMap)
    )
  }
  findMonoRelationshipData (relationshipName: string) : $$selector<Map<string, X>> {
    return createSelector(
      [
        (state) => state[this.erschemaReducerName].relationships[this.name][relationshipName]
      ],
      (relationships: Map<string, $$id>) => (relationships || defaultMap)
    )
  }
  get (idsSelector: $$selector<List<$$id>>) : $$selector<List<X>> {
    return createSelector(
      [
        idsSelector,
        this.findEntityData()
      ],
      (ids: List<$$id>, entities: Map<string, X>) => {
        return ids.map(id => entities.get(`${id}`) || this.defaultModel)
      }
    )
  }

  find (idSelector?: $$idSelector = defaultIdSelector) : $$selector<X> {
    return createSelector(
      [
        idSelector,
        this.findEntityData()
      ],
      (id: $$id, entities: Map<string, X>) => {
        return entities.get(`${id}`) || this.defaultModel
      }
    )
  }
  getRawRelatedIds (relationshipName: string, idSelector?: $$idSelector = defaultIdSelector) : $$selector<OrderedSet<$$id>> {
    return createSelector(
      [
        idSelector,
        this.findManyRelationshipData(relationshipName),
      ],
      (id: $$id, relationships: Map<string, OrderedSet<$$id>>) => (relationships.get(`${id}`) || defaultOrderedSet)
    )
  }
  getRelatedIds (relationshipName: string, idSelector?: $$idSelector = defaultIdSelector) : $$selector<List<$$id>> {
    return createSelector(
      [
        this.getRawRelatedIds(relationshipName, idSelector)
      ],
      (ids: OrderedSet<$$id>) => ids.toList()
    )
  }
  findRelatedId (relationshipName: string, idSelector?: $$idSelector = defaultIdSelector) : $$selector<$$id> {
    return createSelector(
      [
        idSelector,
        this.findMonoRelationshipData(relationshipName),
      ],
      (id: $$id, relationships: Map<string, $$id>) => relationships.get(`${id}`, 0)
    )
  }
}
