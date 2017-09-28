'use strict';

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _erschema = require('erschema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('reducer', function () {
  var Model = function Model() {
    _classCallCheck(this, Model);
  };

  it('returns basic reducer', function () {
    var basicReducer = (0, _reducer2.default)({ schema: {} });
    expect(basicReducer(undefined, {})).toEqual({ entities: {}, relationships: {} });
  });
  it('returns with one entity', function () {
    var schema = {
      users: (0, _erschema.standardizeEntity)({ properties: ['name'], Model: Model })
    };
    var basicReducer = (0, _reducer2.default)({ schema: schema });
    expect(basicReducer(undefined, {}).entities.users.toJS()).toEqual({ data: {} });
    expect(basicReducer(undefined, {}).relationships.users.toJS()).toEqual({});
  });
});