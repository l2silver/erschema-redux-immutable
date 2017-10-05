'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxActions = require('redux-actions');

var _resourceActionTypes = require('resource-action-types');

var _resourceActionTypes2 = _interopRequireDefault(_resourceActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  create: function create(entityName, entity) {
    if (entity instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.create(entityName))(entity);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.create(entityName))({ entity: entity });
  },
  update: function update(entityName, entity) {
    if (entity instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.update(entityName))(entity);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.update(entityName))({ entity: entity });
  },
  remove: function remove(entityName, entityId) {
    if (entityId instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.remove(entityName))(entityId);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.remove(entityName))({ id: entityId });
  },
  get: function get(entityName, entity) {
    if (entity instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.get(entityName))(entity);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.get(entityName))({ entity: entity });
  },
  index: function index(entityName, entities) {
    if (entities instanceof Error) {
      return (0, _reduxActions.createAction)(_resourceActionTypes2.default.index(entityName))(entities);
    }
    return (0, _reduxActions.createAction)(_resourceActionTypes2.default.index(entityName))({ entities: entities });
  }
};