'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _immutable = require('immutable');

var _erschema = require('erschema');

var ONE = _erschema.relationshipTypes.ONE,
    MANY = _erschema.relationshipTypes.MANY;


var getRelationshipType = function getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, relationshipName) {
  if (mapOfRelationshipTypesById) {
    return mapOfRelationshipTypesById[id][relationshipName];
  }
  return mapOfRelationshipTypes[relationshipName];
};
exports.default = {
  reorder: function reorder(mapOfRelationshipTypes, mapOfRelationshipTypesById) {
    return function (state, _ref) {
      var payload = _ref.payload,
          error = _ref.error;

      if (error) {
        return state;
      }
      var _payload$changeRelati = payload.changeRelationshipOrder,
          name = _payload$changeRelati.name,
          id = _payload$changeRelati.id,
          ordinal = _payload$changeRelati.ordinal,
          originalOrdinal = _payload$changeRelati.originalOrdinal;

      var relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, name);
      if (relationshipType === undefined) {
        throw new Error('Trying to reorder on relationship ' + name + ' that does not exist');
      }
      return state.updateIn([name, '' + id], function (ids) {
        if (!ids) {
          throw new Error('No relationship ' + name + ' values to reorder on');
        }
        var idsArray = ids.toArray();
        var value = idsArray[originalOrdinal];
        idsArray.splice(originalOrdinal, 1);
        idsArray.splice(ordinal, 0, value);
        return new _immutable.OrderedSet(idsArray);
      });
    };
  },
  link: function link(mapOfRelationshipTypes, mapOfRelationshipTypesById) {
    return function (state, _ref2) {
      var payload = _ref2.payload,
          error = _ref2.error;

      if (error) {
        return state;
      }
      var _payload$relationship = payload.relationship,
          relationshipName = _payload$relationship.relationshipName,
          id = _payload$relationship.id,
          relationshipValue = _payload$relationship.relationshipValue;

      var relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, relationshipName);
      if (relationshipType === undefined) {
        throw new Error('Trying to link on relationship ' + name + ' that does not exist');
      }
      if (relationshipType === MANY) {
        return state.updateIn([relationshipName, '' + id], function (ids) {
          if (ids) {
            return ids.add(relationshipValue);
          }
          return new _immutable.OrderedSet([relationshipValue]);
        });
      }
      return state.setIn([relationshipName, '' + id], relationshipValue);
    };
  },
  createRelationship: function createRelationship(mapOfRelationshipTypes, mapOfRelationshipTypesById) {
    return function (state, _ref3) {
      var payload = _ref3.payload,
          error = _ref3.error;

      if (error) {
        return state;
      }
      var _payload$relationship2 = payload.relationship,
          relationshipName = _payload$relationship2.relationshipName,
          id = _payload$relationship2.id,
          relationshipValue = _payload$relationship2.relationshipValue;

      var relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, relationshipName);
      if (relationshipType === MANY) {
        return state.setIn([relationshipName, '' + id], new _immutable.OrderedSet([relationshipValue]));
      }
      return state.setIn([relationshipName, '' + id], relationshipValue);
    };
  },
  concatRelationship: function concatRelationship(mapOfRelationshipTypes, mapOfRelationshipTypesById) {
    return function (state, _ref4) {
      var payload = _ref4.payload,
          error = _ref4.error;

      if (error) {
        return state;
      }
      var _payload$relationship3 = payload.relationships,
          name = _payload$relationship3.name,
          idValuePairs = _payload$relationship3.idValuePairs;

      var relationshipType = mapOfRelationshipTypes[name];
      return state.updateIn([name], function (relationships) {
        return idValuePairs.reduce(function (finalResult, _ref5) {
          var id = _ref5.id,
              value = _ref5.value;

          return finalResult.updateIn(['' + id], function (existingValues) {
            if (existingValues) {

              return existingValues.concat(value);
            }
            return new _immutable.OrderedSet(value);
          });
        }, relationships);
      });
    };
  },
  unlink: function unlink(mapOfRelationshipTypes, mapOfRelationshipTypesById) {
    return function (state, _ref6) {
      var payload = _ref6.payload,
          error = _ref6.error;

      if (error) {
        return state;
      }
      var _payload$relationship4 = payload.relationship,
          relationshipName = _payload$relationship4.relationshipName,
          id = _payload$relationship4.id,
          relationshipValue = _payload$relationship4.relationshipValue;

      var relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, relationshipName);
      if (relationshipType === MANY) {
        return state.updateIn([relationshipName, '' + id], function (ids) {
          if (ids) {
            return ids.remove(relationshipValue);
          }
          return new _immutable.OrderedSet();
        });
      }
      return state.setIn([relationshipName, '' + id], 0);
    };
  },
  indexRelationship: function indexRelationship(mapOfRelationshipTypes, mapOfRelationshipTypesById) {
    return function (state, _ref7) {
      var payload = _ref7.payload,
          error = _ref7.error;

      if (error) {
        return state;
      }
      var _payload$relationship5 = payload.relationships,
          name = _payload$relationship5.name,
          idValuePairs = _payload$relationship5.idValuePairs;

      var relationshipType = mapOfRelationshipTypes[name];
      return state.updateIn([name], function (relationships) {
        return idValuePairs.reduce(function (finalResult, _ref8) {
          var id = _ref8.id,
              value = _ref8.value;

          if (mapOfRelationshipTypesById) {
            relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, id, name);
          }
          var finalValue = relationshipType === MANY ? new _immutable.OrderedSet(value) : value;
          return finalResult.set('' + id, finalValue);
        }, relationships);
      });
    };
  },
  remove: function remove(mapOfRelationshipTypes, relationshipNames, mapOfRelationshipTypesById) {
    return function (state, _ref9) {
      var payload = _ref9.payload,
          error = _ref9.error;

      if (error) {
        return state;
      }
      var id = payload.id;

      return relationshipNames.reduce(function (finalResult, _ref10) {
        var _ref11 = _slicedToArray(_ref10, 2),
            relationshipName = _ref11[0],
            page = _ref11[1];

        var relationshipType = getRelationshipType(mapOfRelationshipTypes, mapOfRelationshipTypesById, page || id, relationshipName);
        if (page) {
          if (relationshipType === MANY) {
            return finalResult.updateIn([relationshipName, page], function (ids) {
              return ids && ids.delete(id);
            });
          }
          return finalResult.updateIn([relationshipName, page], function (idValue) {
            return idValue === id ? 0 : idValue;
          });
        }
        if (relationshipType === MANY) {
          return finalResult.updateIn([relationshipName], function (mapOfIds) {
            return mapOfIds.map(function (ids) {
              return ids && ids.delete(id);
            });
          });
        }
        return finalResult.updateIn([relationshipName], function (mapOfIds) {
          return mapOfIds.map(function (idValue) {
            return idValue === id ? 0 : idValue;
          });
        });
      }, state);
    };
  }
};