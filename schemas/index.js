'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = standardizeEntity;

var _lodash = require('lodash');

function standardizeEntity(_ref) {
  var idFunc = _ref.idFunc,
      properties = _ref.properties,
      _ref$modifier = _ref.modifier,
      modifier = _ref$modifier === undefined ? function (ent) {
    return ent;
  } : _ref$modifier,
      Model = _ref.Model,
      relationships = _ref.relationships,
      premodifier = _ref.premodifier;

  if (!Model) {
    throw TypeError('Model attribute of schema is missing');
  }
  if (!properties) {
    throw TypeError('properties attribute of schema is missing');
  }
  var finalModifier = (0, _lodash.flowRight)([function (ent) {
    return (0, _lodash.pick)(ent, Array.isArray(properties) ? properties : Object.keys(properties));
  }, modifier]);
  return {
    idFunc: idFunc,
    modifier: finalModifier,
    Model: Model,
    relationships: relationships,
    premodifier: premodifier
  };
}