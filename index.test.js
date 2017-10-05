'use strict';

var _immutable = require('immutable');

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _schemas = require('../schemas');

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('reducer', function () {
  var Model = function Model() {
    _classCallCheck(this, Model);
  };

  it('returns basic reducer', function () {
    var basicReducer = (0, _2.default)({ schema: {} });
    expect(basicReducer(undefined, {})).toEqual({ entities: {}, relationships: {} });
  });
  it('returns with one entity', function () {
    var schema = {
      users: (0, _schemas2.default)({ properties: ['name'], Model: Model })
    };
    var basicReducer = (0, _2.default)({ schema: schema });
    expect(basicReducer(undefined, {}).entities.users).toEqual(new _immutable.Map());
    expect(basicReducer(undefined, {}).relationships.users.toJS()).toEqual({});
  });
});