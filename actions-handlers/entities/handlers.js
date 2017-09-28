'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mergeDeepOverwriteList = require('./mergeDeepOverwriteList');

var _mergeDeepOverwriteList2 = _interopRequireDefault(_mergeDeepOverwriteList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = {
  create: function create(modelGenerator) {
    var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return function (state, _ref) {
      var payload = _ref.payload,
          error = _ref.error;

      if (error) {
        return state;
      }
      var Model = modelGenerator(payload.entity);
      var entity = new Model(payload.entity);
      var nextState = state.setIn(location.concat(['' + payload.entity.id]), entity);
      return nextState;
    };
  },
  remove: function remove() {
    var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return function (state, _ref2) {
      var payload = _ref2.payload,
          error = _ref2.error;

      if (error) {
        return state;
      }
      return state.deleteIn(location.concat(['' + payload.id]));
    };
  },
  update: function update() {
    var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return function (state, _ref3) {
      var payload = _ref3.payload,
          error = _ref3.error;

      if (error) {
        return state;
      }

      var _payload$entity = payload.entity,
          id = _payload$entity.id,
          otherProps = _objectWithoutProperties(_payload$entity, ['id']);

      return state.mergeIn(location.concat(['' + id]), otherProps);
    };
  },
  get: function get(modelGenerator) {
    var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return function (state, _ref4) {
      var payload = _ref4.payload,
          error = _ref4.error;

      if (error) {
        return state;
      }
      return state.updateIn(location.concat(['' + payload.entity.id]), function (previousEntity) {
        if (previousEntity) {
          return previousEntity.mergeWith(_mergeDeepOverwriteList2.default, payload.entity);
        }
        return new (modelGenerator(payload.entity))(payload.entity);
      });
    };
  },
  index: function index(modelGenerator) {
    var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return function (state, _ref5) {
      var payload = _ref5.payload,
          error = _ref5.error;

      if (error) {
        return state;
      }
      return payload.entities.reduce(function (finalResult, entity) {
        return finalResult.updateIn(location.concat(['' + entity.id]), function (previousEntity) {
          if (previousEntity) {
            return previousEntity.mergeWith(_mergeDeepOverwriteList2.default, entity);
          }
          var Model = modelGenerator(entity);
          return new Model(entity);
        });
      }, state);
    };
  }
};