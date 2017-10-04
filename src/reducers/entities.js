// @flow
import {handleActions} from 'redux-actions'
import actionNames from 'resource-action-types'
import {Map} from 'immutable'
import handlers from '../actions-handlers/entities/handlers';

type $props = {
  name: string,
	options?: Object,
  otherActions?: Object,
  modelGenerator?: (entity: Object) => Class<any>,
  Model?: Class<any>,
  locationPath?: string[],
  defaultStateConfig?: Object,
};


export default function ({name, Model, modelGenerator, defaultStateConfig = {}, otherActions = {}, locationPath}: $props) {
  let finalModelGenerator
  if (Model) {
    // $FlowFixMe
    finalModelGenerator = () => Model
  }
  else if (modelGenerator) {
    finalModelGenerator = modelGenerator
  }
  else {
    throw new TypeError('please include Model or modelGenerator')
  }
  return handleActions(
    {
      [actionNames.create(name)]: handlers.create(finalModelGenerator, locationPath),
      [actionNames.update(name)]: handlers.update(locationPath),
      [actionNames.remove(name)]: handlers.remove(locationPath),
      [actionNames.get(name)]: handlers.get(finalModelGenerator, locationPath),
      [actionNames.index(name)]: handlers.index(finalModelGenerator, locationPath),
      ...otherActions
    },
    new Map(defaultStateConfig))
}