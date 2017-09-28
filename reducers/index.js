'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relationshipPageReducer = exports.relationshipReducer = exports.entityReducer = undefined;

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _entities = require('./entities');

var _entities2 = _interopRequireDefault(_entities);

var _relationships = require('./relationships');

var _relationships2 = _interopRequireDefault(_relationships);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _reducer2.default;
exports.entityReducer = _entities2.default;
exports.relationshipReducer = _relationships2.default;
exports.relationshipPageReducer = _relationships.relationshipPageReducer;