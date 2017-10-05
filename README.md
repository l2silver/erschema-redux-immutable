# erschema-redux-immutable

A smart immutablejs library for managing the redux-store

### Basic Concepts

Redux applications all have a few key components. Reducers to change the store's state, actions to trigger the reducer, and selectors to pull data from the store.
Most applications will write a custom function for each case in a reducer function, which generally require custom actions to trigger the reducer, and custom selectors to retreive the data.
erschema-redux-immutable uses standard RESTful reducers and actions, which also results in a standardized store state that is easy to select data from.

### Redux Store

The erschema-redux-immutable provides a reducer function that stores data in two basic places: Entities, and Relationships.

```
import {Record, Map} from 'immutable'
// Example redux store with erschema
{
  other store properties...,
  erschema: {
    entities: {
      users: Map<{
        id: UserRecord<{id, name}>
      }>
    },
    relationships: {
      users: Map<{
        friends: Map<{
          [userId]: OrderedList<friendId> (For one to many relationships) || friendId (for one to one relationships)
        }>
      }>
    }
  }
}
```

#### Schemas

erschema-redux-immutable uses [erschema](https://github.com/l2silver/erschema) schemas to normalize data, and construct the structure of the redux-store

```
import {combineReducers} from 'redux'
import standardizeSchema from 'erschema-redux-immutable/schemas'
import erschemaReducer from 'erschema-redux-immutable/reducers'

const usersSchema = standardizeSchema({
  properties: string[] | {[key: string]: any},
  idFunc: (entity)=>entity.id,
  modifier: (ent)=>ent,
  premodifier: (ent)=>ent
  Model: UserModel,
  relationships: [
      {
        name: 'friends',
        entityName: 'users',
      }
    ],
  },
})

// standardizeSchema has one purpose, it takes the known properties of a model and blacklists all other properties using a modifier function that pipes into any other modifier functions. This is especially useful when dealing with Immutable.Record models that actually error out when the wrong properties are passed to it for certain actions.

combineReducers({
  ...otherReducers,
  erschemaReducer({
    schemas: {
      users,
    }
  })
})

===> creates a redux store with the following structure

{
  ...otherReducers,
  erschema: {
    entities: Map<{
      users: Map<{
      }>
    }>,
    relationships: Map<{
      users: Map<{
        friends: Map<{}>
      }>
    }>
  }
}

```


### Handlers

#### The standardize erschema handlers for relationships are:

```
import {
  link,
  unlink,
  create,
  index,
  concat,
  reorder,

} from 'erschema-redux-immutable/handlers/relationships
```

##### link

Adds a relatedEntityId to a relationship for one-to-many relationships, or for one-to-one relationship, changes relatedEntityId value

```
// Relationship change for links one-to-many and one-to-one respectively
{
  [entityId]: [] ===> [relatedEntityId] || 0 ===> relatedEntityId 
}
```

##### unlink

Removes a relatedEntityId from a relationship for one-to-many relationships, or for one-to-one relationship, changes relatedEntityId value to 0

```
// Relationship change for links one-to-many and one-to-one respectively
{
  [entityId]: [relatedEntityId] ===> [] || relatedEntityId ===> 0
}
```

##### create

Creates a relationship entry for an entityId
```
// Relationship created for links one-to-many and one-to-one respectively
{} ===> {
        [entityId]: [relatedEntityId] || relatedEntityId 
      }
```

##### index

Creates a relationship entry for multiple entity ids
```
// Relationship created for links one-to-many and one-to-one respectively
{} ===> {
        [entityId]: [relatedEntityId] || relatedEntityId ,
        [entityId2]: [relatedEntityId2] || relatedEntityId2 ,
        [entityId3]: [relatedEntityId3] || relatedEntityId3 
      }
```

##### concat

Adds multiple relatedEntityIds to an existing relationship for multiple
```
{
  [entityId]: [relatedEntityId] ===> [relatedEntityId, relatedEntityId2, relatedEntityId3]
}
```

##### reorder

Reorders relationship
```
{
  [entityId]: [relatedEntityId, relatedEntityId2, relatedEntityId3] ===> [relatedEntityId2, relatedEntityId, relatedEntityId3]
}
```

#### The standardized erschema handlers for entities are:
```
import {
  create
  update
  remove
  get
  index
} from 'erschema-redux-immutable/handlers/entities
```

##### create

creates an entity
```
{
  data: {} ===> {
                  [entityId]: entity 
                }
}
```

##### update

updates an entity
```
{
  data: {
   [entityId]: entity ===> entity2
  }
}
```

##### remove

removes an entity
```
{
  data: {[entityId]: entity} ===> {}
}
```

##### get

similar to create entity except merges with previous existing entity if it exists
```
{
  data: {} ===> {
                  [entityId]: entity 
                }
}
```

##### index

similar to get except takes an array of entities instead of just one
```
{
  data: {} ===> {
                  [entityId]: entity,
                  [entityId]: entity,
                  [entityId]: entity,
                }
}
```

### Reducers

The handlers above are stored in reducers for specific entities and relationships

#### Entity Reducers

recall that reduxStore has the following shape

```
  {
    entities: {
      users: Map<{
        id: UserRecord<{id, ...}>
      }>
    },
    relationships: ...,
  }
```

The entity reducer has the following state structure:

```
Map<{
  id: UserRecord<{id, ...}>
}>
```

The entity reducer has all of the standard entity handlers built in to it.

```
import entityReducer from 'erschema-redux-immutable/reducers/entities'

const userEntityReducer = entityReducer({
  name: 'users',
  ---
  Model: UserModel,
  or
  modelGenerator: (ent)=>ent.inactive ? new InActiveUser(ent) : new ActiveUser(ent),
  ---
  otherActions: Object of additional handlers to put in reducer
  defaultStateConfig: A plain javascript object to be wrapped by the immutable Map
})
```


#### Relationship Reducers

recall that reduxStore has the following shape

```
  {
    entities: ...,
    relationships: {
      users: Map<{
        friends: Map<{
          [userId]: OrderedList<friendId> (For one to many relationships) || friendId (for one to one relationships)
        }>
      }>
    }
  }
```

the relationship reducer acts on the users relationship map, and encompasses:

```
Map<{
  friends: Map<{
    [userId]: OrderedList<friendId> (For one to many relationships) || friendId (for one to one relationships)
  }>
}>
```

This relationship reducer has all of the standard relationship handlers in addition to handlers for specific entity remove actions. The latter is used to clean relationship data when entities are deleted from the redux store, and in order for the reducer to do this, it must understand the relationship schema for a specific entity schema.

```
import relationshipReducer from 'erschema-redux-immutable/reducers/relationships'
const userRelationshipReducer = relationshipReducer({
  entityName: 'users',
  relationshipSchema: [{
    name: 'friends',
    entityName: 'users,
  }]
})
```

This way, when a user is deleted, the reducer knows to look through those relationships for the deleted id, and remove it.

### Erschema-Redux-Immutable Reducer

The entity and relationship reducers can be used as directed above, but you can also use the generateErschemaReduxImmutableReducer to generate the entity reducers and relationship reducers for all of the entities in the schema.

```
import generateErschemaReduxImmutableReducer from 'erschema-redux-immutable'
import usersSchema from './schemas/users'

const erschemaReduxImmutableReducer = generateErschemaReduxImmutableReducer({
  schema: {
    users: usersSchema
  }
})
```

### Actions

All standard actions are paired with their respective handlers to complete state changes

#### The standardize erschema actions for relationships are:

```
import {
  link,
  unlink,
  create,
  index,
  concat,
  reorder,

} from 'erschema-redux-immutable/actions/relationships

type $id = string | number;
type $relationship = {
  relationshipName: string,
  id: $id,
  relationshipValue: $id | $id[]
};

type $relationships = {
  name: string;
  idValuePairs: Array<{id: $id, value: $id | $id[]}>;
};

type $changeRelationshipOrder = {
  name: string,
  id: $id,
  originalOrdinal: number,
  ordinal: number,
}
```

##### link

link(entityName, $relationship, ?error)

##### unlink

unlink(entityName, $relationship, ?error)

##### create

create(entityName, $relationship, ?error)

##### index

index(entityName, $relationships, ?error)

##### concat

concat(entityName, $relationships, ?error)

##### reorder

reorder(entityName, $changeRelationshipOrder, ?error)


#### The standardized erschema actions for entities are:
```
import {
  create
  update
  remove
  get
  index
} from 'erschema-redux-immutable/actions/entities

type $entity = {id: $id, ...}
```

##### create

create(entityName: string, entity: $entity, error?: boolean)

##### update

update(entityName: string, entity: $entity, error?: boolean)

##### remove

remove(entityName: string, entityId: $id, error?: boolean)

##### get

get(entityName: string, entity: $entity, error?: boolean)

##### index

index(entityName: string, entities: $entity[], error?: boolean)

### The Normalize Action

```
import normalizeActions from 'erschema-redux-immutable/actions/normalize'
import schema from './schema'

const userWithNestedData = {
  id: 1,
  name: 'Example',
  friends: [{
    id: 2,
    name: 'Another Example',
  }]
}

normalizeActions('users', userWithNestedData, schema)
===>
{
  indexEntities: [{
    type: 'INDEX_USERS',
    payload: {
      entities: [
        {
          id: 1,
          name: 'Example'
        },
        {
          id: 2,
          name: 'Another Example'
        }
      ]
    }
  }],
  indexRelationships: [{
    type: 'INDEX_RELATIONSHIP_USERS',
    payload: {
      relationships: {
        id: 1,
        idValues: [2]
      }
    }
  }]
}
```
As you can see, normalizeActions breaks down a nested object into an array of entity and relationship index actions. You can use your own batched action mechanism for handling these actions in a performant way, like redux-batched-actions.