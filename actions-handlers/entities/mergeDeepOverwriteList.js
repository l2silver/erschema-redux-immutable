'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = mergeDeepOverwriteList;

var _immutable = require('immutable');

function mergeDeepOverwriteList(prev, next) {
  if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
    if (_immutable.List.isList(prev)) {
      return new _immutable.List(next);
    } else {
      if (prev && (typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === 'object' && prev.mergeWith) {
        return prev.mergeWith(mergeDeepOverwriteList, next);
      }
      return next;
    }
  }
  return next;
}