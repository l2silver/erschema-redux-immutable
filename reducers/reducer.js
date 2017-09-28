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
      _ref$overlordActions = _ref.overlordActions,
      overlordActions = _ref$overlordActions === undefined ? {} : _ref$overlordActions,
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
    pageRelationship.pages = relationships.pages || (0, _relationships.relationshipPageReducer)({ name: 'pages', relationshipsSchema: getPageRelationships(pageSchema) });
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
      name: schemaName,
      relationshipsSchema: relationshipSchemas
    });
    return finalResult;
  }, pageRelationship);
  var entityRelationshipReducers = (0, _redux.combineReducers)({
    entities: (0, _redux.combineReducers)(entityReducers),
    relationships: (0, _redux.combineReducers)(relationshipReducers)
  });
  return (0, _reduxOverlord2.default)(entityRelationshipReducers, (0, _hor2.default)(overlordActions));
};

var _immutable = require('immutable');

var _reduxOverlord = require('redux-overlord');

var _reduxOverlord2 = _interopRequireDefault(_reduxOverlord);

var _redux = require('redux');

var _entities = require('./entities');

var _entities2 = _interopRequireDefault(_entities);

var _relationships = require('./relationships');

var _relationships2 = _interopRequireDefault(_relationships);

var _hor = require('./hor');

var _hor2 = _interopRequireDefault(_hor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPageRelationships = function getPageRelationships(pageSchema) {
  return Object.keys(pageSchema).reduce(function (finalResult, pageName) {
    finalResult[pageName] = pageSchema[pageName].relationships;
    return finalResult;
  }, {});
};

var getPageModelGenerator = function getPageModelGenerator(schema) {
  return function (entity) {
    return schema[entity.id].Model;
  };
};