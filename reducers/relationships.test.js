'use strict';

var _immutable = require('immutable');

var Immutable = _interopRequireWildcard(_immutable);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _erschema = require('erschema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MANY = _erschema.relationshipTypes.MANY,
    ONE = _erschema.relationshipTypes.ONE;


var getId = function getId() {
  return Math.round(Math.random() * 1000000);
};
var Record = Immutable.Record,
    Map = Immutable.Map,
    OrderedSet = Immutable.OrderedSet;


describe('entityReducer', function () {
  var name = 'users';
  var relationshipsSchema = {
    manyRelationships: {
      friends: [{
        name: 'people'
      }]
    },
    monoRelationships: {
      friend: [{
        name: 'people'
      }]
    }
  };

  function getDefaultState() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new (Record({ friend: new Map(), friends: new Map(initialState) }))();
  }
  it('returns default state', function () {
    var defaultState = getDefaultState();
    var usersReducer = (0, _reducer2.default)({ name: name, relationshipsSchema: relationshipsSchema });
    expect(usersReducer(undefined, { type: 1 }).toObject()).toEqual(defaultState.toObject());
  });
  it('returns default state with config', function () {
    var defaultState = new (Record({ friend: new Map(), friends: new Map(), otherData: new Map() }))();
    var usersReducer = (0, _reducer2.default)({ name: name, relationshipsSchema: relationshipsSchema, defaultStateConfig: { otherData: new Map() } });
    expect(usersReducer(undefined, { type: 1 }).toObject()).toEqual(defaultState.toObject());
  });
  describe('actions', function () {
    var usersReducer = (0, _reducer2.default)({ name: name, relationshipsSchema: relationshipsSchema });
    var friendId = getId();
    it('creates Single', function () {
      var id = getId();
      expect(usersReducer(undefined, _actions2.default.link(name, { relationshipName: 'friend', id: id, relationshipValue: friendId })).friend).toEqual(new Map(_defineProperty({}, id, friendId)));
    });
    it('creates Multi', function () {
      var id = getId();
      expect(usersReducer(undefined, _actions2.default.link(name, { relationshipName: 'friends', id: id, relationshipValue: friendId })).friends).toEqual(new Map(_defineProperty({}, id, OrderedSet([friendId]))));
    });
    it('reorder', function () {
      var id = getId();
      var initialState = getDefaultState(_defineProperty({}, id, new OrderedSet([0, 1, 2])));
      var finalState = getDefaultState(_defineProperty({}, id, new OrderedSet([1, 0, 2])));
      expect(usersReducer(initialState, _actions2.default.reorder(name, { name: 'friends', id: id, ordinal: 2, originalOrdinal: 0 })).friends).toEqual(new Map(_defineProperty({}, id, OrderedSet([1, 2, 0]))));
    });
  });
});