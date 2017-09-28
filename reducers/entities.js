'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var _extends2;

  var name = _ref.name,
      Model = _ref.Model,
      modelGenerator = _ref.modelGenerator,
      _ref$defaultStateConf = _ref.defaultStateConfig,
      defaultStateConfig = _ref$defaultStateConf === undefined ? {} : _ref$defaultStateConf,
      _ref$otherActions = _ref.otherActions,
      otherActions = _ref$otherActions === undefined ? {} : _ref$otherActions,
      locationPath = _ref.locationPath;

  var finalModelGenerator = void 0;
  if (Model) {
    // $FlowFixMe
    finalModelGenerator = function finalModelGenerator() {
      return Model;
    };
  } else if (modelGenerator) {
    finalModelGenerator = modelGenerator;
  } else {
    throw new TypeError('please include Model name');
  }
  return (0, _reduxActions.handleActions)(_extends((_extends2 = {}, _defineProperty(_extends2, _resourceActionTypes2.default.create(name), _handlers2.default.create(finalModelGenerator, locationPath)), _defineProperty(_extends2, _resourceActionTypes2.default.update(name), _handlers2.default.update(locationPath)), _defineProperty(_extends2, _resourceActionTypes2.default.remove(name), _handlers2.default.remove(locationPath)), _defineProperty(_extends2, _resourceActionTypes2.default.get(name), _handlers2.default.get(finalModelGenerator, locationPath)), _defineProperty(_extends2, _resourceActionTypes2.default.index(name), _handlers2.default.index(finalModelGenerator, locationPath)), _extends2), otherActions), new _immutable.Map(defaultStateConfig));
};

var _reduxActions = require('redux-actions');

var _resourceActionTypes = require('resource-action-types');

var _resourceActionTypes2 = _interopRequireDefault(_resourceActionTypes);

var _immutable = require('immutable');

var _handlers = require('../actions-handlers/entities/handlers');

var _handlers2 = _interopRequireDefault(_handlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }