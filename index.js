'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var schema = _ref.schema,
      _ref$entities = _ref.entities,
      entities = _ref$entities === undefined ? {} : _ref$entities,
      _ref$relationships = _ref.relationships,
      relationships = _ref$relationships === undefined ? {} : _ref$relationships,
      pageSchema = _ref.pageSchema,
      pageOtherActionHandlers = _ref.pageOtherActionHandlers;

  var pageEntity = {};
  var pageRelationship = {};
  if (pageSchema) {
    pageEntity.pages = entities.pages || (0, _entities2.default)({
      name: 'pages',
      modelGenerator: getPageModelGenerator(pageSchema),
      otherActions: pageOtherActionHandlers,
      defaultStateConfig: Object.keys(pageSchema).reduce(function (finalResult, key) {
        finalResult[key] = new pageSchema[key].Model();
        return finalResult;
      }, {})
    });
    pageRelationship.pages = relationships.pages || (0, _relationships.relationshipPageReducer)({ entityName: 'pages', relationshipsSchema: getPageRelationships(pageSchema) });
  }
  var entityReducers = Object.keys(schema).reduce(function (finalResult, schemaName) {
    var entitySchema = schema[schemaName];
    finalResult[schemaName] = entities[schemaName] || (0, _entities2.default)({
      name: schemaName,
      Model: entitySchema.Model
    });
    return finalResult;
  }, pageEntity);
  var relationshipReducers = Object.keys(schema).reduce(function (finalResult, schemaName) {
    var entitySchema = schema[schemaName];
    var relationshipSchemas = entitySchema.relationships;

    finalResult[schemaName] = relationships[schemaName] || (0, _relationships2.default)({
      entityName: schemaName,
      relationshipsSchema: relationshipSchemas
    });
    return finalResult;
  }, pageRelationship);
  return (0, _redux.combineReducers)({
    entities: (0, _redux.combineReducers)(entityReducers),
    relationships: (0, _redux.combineReducers)(relationshipReducers)
  });
};

var _immutable = require('immutable');

var _redux = require('redux');

var _entities = require('./reducers/entities');

var _entities2 = _interopRequireDefault(_entities);

var _relationships = require('./reducers/relationships');

var _relationships2 = _interopRequireDefault(_relationships);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPageRelationships = function getPageRelationships(pageSchema) {
  var results = Object.keys(pageSchema).reduce(function (finalResult, pageName) {
    finalResult[pageName] = pageSchema[pageName].relationships;
    return finalResult;
  }, {});
  console.log('r', results);
  return results;
};

var getPageModelGenerator = function getPageModelGenerator(schema) {
  return function (entity) {
    return schema[entity.id].Model;
  };
};