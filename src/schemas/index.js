// @flow
import {flowRight, pick} from 'lodash';

export default function standardizeEntity (
  {
    idFunc,
    properties,
    modifier = (ent)=>ent,
    Model,
    relationships,
    premodifier
  }: Object) {
  if (!Model) {
    throw TypeError('Model attribute of schema is missing')
  }
  if (!properties) {
    throw TypeError('properties attribute of schema is missing')
  }
  const finalModifier = flowRight([
    (ent)=>pick(ent, Array.isArray(properties) ? properties : Object.keys(properties)),
    modifier,
  ]);
  return {
    idFunc,
    modifier: finalModifier,
    Model,
    relationships,
    premodifier,
  }
}
