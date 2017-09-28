// @flow
import {handleActions} from 'redux-actions'
export type $mapOf<X> = {[key: string]: X};
export type $reducer = (state: any, action: any)=>any;
export default function(otherActions: $mapOf<$reducer>){
  return handleActions({
    ...otherActions
  })
}