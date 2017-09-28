'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = generateDefaultState;

var _immutable = require('immutable');

function generateDefaultState() {
  var defaultPropsConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var DefaultState = (0, _immutable.Record)(_extends({}, defaultPropsConfig));
  var defaultState = new DefaultState();
  return defaultState;
}