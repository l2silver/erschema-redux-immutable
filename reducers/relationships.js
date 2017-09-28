'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref4) {
  var _extends2;

  var name = _ref4.name,
      _ref4$relationshipsSc = _ref4.relationshipsSchema,
      relationshipsSchema = _ref4$relationshipsSc === undefined ? [] : _ref4$relationshipsSc,
      _ref4$otherActions = _ref4.otherActions,
      otherActions = _ref4$otherActions === undefined ? {} : _ref4$otherActions;

  var relationships = relationshipsSchema;
  var mapOfRelationshipDefaultValues = getMapOfRelationshipDefaultValues(relationships);
  var mapOfRelationshipTypes = getMapOfRelationshipTypes(relationships);
  var mapOfRelationships = getMapOfRelationships(relationships);
  var removeActions = Object.keys(mapOfRelationships).reduce(function (finalResult, relatedEntityName) {
    finalResult[_resourceActionTypes2.default.remove(relatedEntityName)] = _handlers2.default.remove(mapOfRelationshipTypes, mapOfRelationships[relatedEntityName]);
    return finalResult;
  }, {});
  return (0, _reduxActions.handleActions)(_extends((_extends2 = {}, _defineProperty(_extends2, _resourceActionTypes2.default.link(name), _handlers2.default.link(mapOfRelationshipTypes)), _defineProperty(_extends2, _resourceActionTypes2.default.unlink(name), _handlers2.default.unlink(mapOfRelationshipTypes)), _defineProperty(_extends2, _resourceActionTypes2.default.createRelationship(name), _handlers2.default.createRelationship(mapOfRelationshipTypes)), _defineProperty(_extends2, _resourceActionTypes2.default.concatRelationship(name), _handlers2.default.concatRelationship(mapOfRelationshipTypes)), _defineProperty(_extends2, _resourceActionTypes2.default.indexRelationship(name), _handlers2.default.indexRelationship(mapOfRelationshipTypes)), _defineProperty(_extends2, _resourceActionTypes2.default.reorder(name), _handlers2.default.reorder(mapOfRelationshipTypes)), _extends2), removeActions, otherActions), (0, _generateDefaultState2.default)(mapOfRelationshipDefaultValues));
};

exports.relationshipPageReducer = relationshipPageReducer;

var _immutable = require('immutable');

var _reduxActions = require('redux-actions');

var _resourceActionTypes = require('resource-action-types');

var _resourceActionTypes2 = _interopRequireDefault(_resourceActionTypes);

var _erschema = require('erschema');

var _handlers = require('../actions-handlers/relationships/handlers');

var _handlers2 = _interopRequireDefault(_handlers);

var _generateDefaultState = require('./generateDefaultState');

var _generateDefaultState2 = _interopRequireDefault(_generateDefaultState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ONE = _erschema.relationshipTypes.ONE,
    MANY = _erschema.relationshipTypes.MANY;


function getMapOfRelationshipDefaultValues(relationships) {
  var startValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return relationships.reduce(function (finalResult, _ref) {
    var name = _ref.name;

    finalResult[name] = new _immutable.Map({});
    return finalResult;
  }, startValue);
}

function getMapOfRelationshipTypes(relationships) {
  return relationships.reduce(function (finalResult, _ref2) {
    var name = _ref2.name,
        type = _ref2.type;

    finalResult[name] = type;
    return finalResult;
  }, {});
}

function getMapOfRelationships(relationships) {
  var startValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var page = arguments[2];

  return relationships.reduce(function (finalResult, _ref3) {
    var entityName = _ref3.entityName,
        name = _ref3.name;

    if (!finalResult[entityName]) {
      finalResult[entityName] = [];
    }
    finalResult[entityName].push(page ? [name, page] : [name]);
    return finalResult;
  }, startValue);
}

function relationshipPageReducer(_ref5) {
  var _extends3;

  var name = _ref5.name,
      relationshipsSchema = _ref5.relationshipsSchema,
      _ref5$otherActions = _ref5.otherActions,
      otherActions = _ref5$otherActions === undefined ? {} : _ref5$otherActions;

  var relationships = Object.keys(relationshipsSchema).reduce(function (finalResult, page) {
    finalResult[page] = relationshipsSchema[page] || [];
    return finalResult;
  }, {});
  var mapOfRelationshipDefaultValues = Object.keys(relationships).reduce(function (finalResult, page) {
    return getMapOfRelationshipDefaultValues(relationships[page], finalResult);
  }, {});

  var mapOfRelationshipTypes = Object.keys(relationships).reduce(function (finalResult, page) {
    finalResult[page] = getMapOfRelationshipTypes(relationships[page]);
    return finalResult;
  }, {});
  var mapOfRelationships = Object.keys(relationships).reduce(function (finalResult, page) {
    return getMapOfRelationships(relationships[page], finalResult, page);
  }, {});
  var removeActions = Object.keys(mapOfRelationships).reduce(function (finalResult, relatedEntityName) {
    finalResult[_resourceActionTypes2.default.remove(relatedEntityName)] = _handlers2.default.remove({}, mapOfRelationships[relatedEntityName], mapOfRelationshipTypes);
    return finalResult;
  }, {});
  return (0, _reduxActions.handleActions)(_extends((_extends3 = {}, _defineProperty(_extends3, _resourceActionTypes2.default.link(name), _handlers2.default.link({}, mapOfRelationshipTypes)), _defineProperty(_extends3, _resourceActionTypes2.default.unlink(name), _handlers2.default.unlink({}, mapOfRelationshipTypes)), _defineProperty(_extends3, _resourceActionTypes2.default.createRelationship(name), _handlers2.default.createRelationship({}, mapOfRelationshipTypes)), _defineProperty(_extends3, _resourceActionTypes2.default.concatRelationship(name), _handlers2.default.concatRelationship({}, mapOfRelationshipTypes)), _defineProperty(_extends3, _resourceActionTypes2.default.indexRelationship(name), _handlers2.default.indexRelationship({}, mapOfRelationshipTypes)), _extends3), removeActions, otherActions), (0, _generateDefaultState2.default)(mapOfRelationshipDefaultValues));
}