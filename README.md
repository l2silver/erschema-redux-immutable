# erschema-redux-immutable

A smart immutablejs library for managing and accessing the redux-store

### Basic Concepts

Redux applications all have a few key components. Reducers to change the store's state, actions to trigger the reducer, and selectors to pull data from the store.
Most applications will write a custom function for each case in a reducer function, which generally require custom actions to trigger the reducer, and custom selectors to retreive the data.
Erschema-suite uses standard RESTful reducers and actions, which also results in a standardized store state that is easy to select data from.

### Redux Store

The erschema provides a reducer function that stores data in two basic places: Entities, and Relationships.

```
import {Record, Map} from 'immutable'
// Example redux store with erschema
{
  other store properties...,
  erschema: {
    entities: Map<{
      users: Map<{
        id: UserRecord<{id, name}>
      }>
    }>,
    relationships: Map<{
      users: Map<{
        friends: Map<{
          [userId]: OrderedList<friendId> (For one to many relationships) || friendId (for one to one relationships)
        }>
      }>
    }>
  }
}
```

#### Schemas

Erschema uses a modified and flat version of https://github.com/paularmstrong/normalizr to not only normalize data, but also construct the structure of the redux-store

```
import {combineReducers} from 'redux'
import erschemaReducer from 'erschema-redux-immutable/reducers'

const usersSchema = {
  idFunc: (entity)=>entity.id,
  properties: {id: 0, name: ''},
  modifier: (ent)=>ent,
  Model: UserModel,
  relationships: [
      {
        name: 'friends',
        entityName: 'users',
      }
    ],
  },
}

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


### Actions

#### The standardize erschema actions for relationships are:

* link
* unlink
* createRelationship
* indexRelationship
* concatRelationship
* reorder

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

##### createRelationship

Creates a relationship entry for an entityId
```
// Relationship created for links one-to-many and one-to-one respectively
{} ===> {
        [entityId]: [relatedEntityId] || relatedEntityId 
      }
```

##### indexRelationship

Creates a relationship entry for multiple entity ids
```
// Relationship created for links one-to-many and one-to-one respectively
{} ===> {
        [entityId]: [relatedEntityId] || relatedEntityId ,
        [entityId2]: [relatedEntityId2] || relatedEntityId2 ,
        [entityId3]: [relatedEntityId3] || relatedEntityId3 
      }
```

##### concatRelationship

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

#### The standardized erschema actions for entities are:

* create
* update
* remove
* get
* index

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

##### get/index

gets for adding a single entity, or index for adding multiple entities of the same type.

get and index are also special because these are the actions that do normalizing. So anytime you get an object, and it has nested entities in it, you must use either get or index to store the normalized data properly in the reducer

#### The Action Class

Instead of calling the actions individually when ever they're needed, erschema-suite comes with an Actions class that stores the basic entity actions in the actions property of the class

```
// Using the get action stored in the Actions class
const USERS = 'users'

class UserActions extends Actions {
  get = (id: number) => dispatch => {
    return userService.get(id).then((user)=>{
      dispatch(this.actions.get(user))
    })
  }
}
export default new UserActions(USERS)
```

### Selectors

Selectors are a way of minimizing rerender cycles in react. See https://github.com/reactjs/reselect for more information

Erschema ships with a Selectors class that comes with a basic set of selectors that can be used to access any part of the redux store, and they are as follows:

* find
* get
* getRelatedIds
* getRelatedId
* findEntityData
* findManyRelationshipData
* findMonoRelationshipData

#### find

Retrieve a single entity

```
// default idSelector is props.id
this.find(idSelector?: (state, props)=>id = (state, props)=>props.id)
```

#### get

Retrieves many entities

```
this.get(idsSelector: (state, props)=>[id])
```

#### findRelatedId

Retrieve related entity id for one-to-one relationship

```
this.findRelatedId(relationshipName: string, idSelector?: (state, props)=>id = (s,p)=>p.id)
```

#### getRelatedIds

Retrieve related entity id for one-to-one relationship

```
this.getRelatedIds(relationshipName: string, idSelector?: (state, props)=>id = (s,p)=>p.id)
```

#### findEntityData, findMonoRelationshipData, findManyRelationshipData

Get all of the respective entities, monoRelationships, and manyRelationships
