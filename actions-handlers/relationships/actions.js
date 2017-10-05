'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxActions = require('redux-actions');

var _resourceActionTypes = require('resource-action-types');

var _resourceActionTypes2 = _interopRequireDefault(_resourceActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  link: function link(entityName, relationship) {
    if (relationship instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.link(entityName))(relationship);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.link(entityName))({ relationship: relationship });
  },
  unlink: function unlink(entityName, relationship) {
    if (relationship instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.unlink(entityName))(relationship);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.unlink(entityName))({ relationship: relationship });
  },
  index: function index(entityName, relationships) {
    if (relationships instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.indexRelationship(entityName))(relationships);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.indexRelationship(entityName))({ relationships: relationships });
  },
  create: function create(entityName, relationship) {
    if (relationship instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.createRelationship(entityName))(relationship);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.createRelationship(entityName))({ relationship: relationship });
  },
  concatRelationship: function concatRelationship(entityName, relationships) {
    if (relationships instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.concatRelationship(entityName))(relationships);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.concatRelationship(entityName))({ relationships: relationships });
  },
  reorder: function reorder(entityName, changeRelationshipOrder) {
    if (changeRelationshipOrder instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.reorder(entityName))(changeRelationshipOrder);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.reorder(entityName))({ changeRelationshipOrder: changeRelationshipOrder });
  }
};