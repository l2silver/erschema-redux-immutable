'use strict';

var _immutable = require('immutable');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getId = function getId() {
  return Math.round(Math.random() * 1000000);
};
describe('reducer', function () {
  var name = 'users';
  var UserModel = function (_Record) {
    _inherits(UserModel, _Record);

    function UserModel() {
      _classCallCheck(this, UserModel);

      return _possibleConstructorReturn(this, (UserModel.__proto__ || Object.getPrototypeOf(UserModel)).apply(this, arguments));
    }

    return UserModel;
  }((0, _immutable.Record)({ id: 0, fullName: '' }));
  function getDefaultState() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new ((0, _immutable.Record)({ data: new _immutable.Map(initialState) }))();
  }
  it('returns default state', function () {
    var defaultState = getDefaultState();
    var userReducer = (0, _reducer2.default)({ name: name, Model: UserModel });
    var result = userReducer(undefined, { type: 1 });
    expect(result.toObject()).toEqual(defaultState.toObject());
  });
  it('returns default state with config', function () {
    var defaultState = new ((0, _immutable.Record)({ data: new _immutable.Map(), otherData: new _immutable.Map() }))();
    var userReducer = (0, _reducer2.default)({ name: name, Model: UserModel, defaultStateConfig: { otherData: new _immutable.Map() } });
    expect(userReducer(undefined, { type: 1 }).toObject()).toEqual(defaultState.toObject());
  });
  describe('actions', function () {
    var userReducer = (0, _reducer2.default)({ name: name, Model: UserModel });
    it('creates', function () {
      var id = getId();
      var patient = new UserModel({ id: id });
      var createAction = _actions2.default.create(name, { id: id });
      var data = userReducer(undefined, createAction).data;
      expect(data).toEqual(new _immutable.Map(_defineProperty({}, id, patient)));
    });
    it('updates', function () {
      var id = getId();
      expect(userReducer(getDefaultState(_defineProperty({}, id, new UserModel({ id: id }))), _actions2.default.update(name, { id: id, fullName: 'John' })).data).toEqual(new _immutable.Map(_defineProperty({}, id, new UserModel({ id: id, fullName: 'John' }))));
    });
    it('removes', function () {
      var id = getId();
      expect(userReducer(getDefaultState(_defineProperty({}, id, new UserModel({ id: id }))), _actions2.default.remove(name, id)).data).toEqual(new _immutable.Map());
    });
    it('gets', function () {
      var id = getId();
      expect(userReducer(getDefaultState(), _actions2.default.get(name, { id: id })).data).toEqual(new _immutable.Map(_defineProperty({}, id, new UserModel({ id: id }))));
    });
    it('indexes', function () {
      var id = getId();
      expect(userReducer(getDefaultState(), _actions2.default.index(name, [{ id: id }])).data).toEqual(new _immutable.Map(_defineProperty({}, id, new UserModel({ id: id }))));
    });
  });
});