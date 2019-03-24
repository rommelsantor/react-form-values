"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _lodash = _interopRequireDefault(require("lodash.get"));

var _lodash2 = _interopRequireDefault(require("lodash.has"));

var _lodash3 = _interopRequireDefault(require("lodash.isequal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var normalizeEmptyValues = function normalizeEmptyValues(input) {
  var output = {};
  Object.entries(input).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return output[key] = value || '';
  });
  return output;
}; // returns 3-element array:
//    [
//      OBJECT getters    key mapped to value
//
//      OBJECT setters    key mapped to setter function
//
//      {
//        FUNC clear()    blank out all known fields
//        BOOL isDirty    non-empty if any values not matching initial values
//        FUNC reset()    set known fields back to initial values
//      }
//    ]


var useFormValues = function useFormValues(initialValues_, onFormChange) {
  var initialValues = normalizeEmptyValues(initialValues_ || {});

  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      form = _useState2[0],
      setFormValues = _useState2[1];

  var _useState3 = (0, _react.useState)(initialValues || {}),
      _useState4 = _slicedToArray(_useState3, 2),
      initials = _useState4[0],
      setInitials = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isDirty = _useState6[0],
      setIsDirty = _useState6[1];

  (0, _react.useEffect)(function () {
    if (!(0, _lodash3.default)(initialValues, initials)) {
      setInitials(initialValues);
      setFormValues(initialValues);
    }
  }, [initialValues]);
  (0, _react.useEffect)(function () {
    setIsDirty(!(0, _lodash3.default)(initials, form));
  }, [initials, form]);

  var getFormValueSetter = function getFormValueSetter(fieldName) {
    return function (value_) {
      return setFormValues(function (prevForm) {
        var didReceiveEvent = _typeof(value_) === 'object' && (0, _lodash2.default)(value_, 'target.value');
        var value = didReceiveEvent ? (0, _lodash.default)(value_, 'target.value') : value_;

        var newForm = _objectSpread({}, prevForm, _defineProperty({}, fieldName, value));

        if (onFormChange) {
          onFormChange(newForm);
        }

        return newForm;
      });
    };
  };

  var rollback = function rollback(eraseValues) {
    var newForm = {};
    Object.keys(initials).forEach(function (field) {
      return newForm[field] = eraseValues ? '' : initials[field] || '';
    });
    setFormValues(newForm);

    if (onFormChange) {
      onFormChange(newForm);
    }
  };

  var reset = function reset() {
    rollback(false);
  };

  var clear = function clear() {
    rollback(true);
  };

  var utils = {
    clear: clear,
    isDirty: isDirty,
    reset: reset
  };
  var settersHandler = {
    get: function get(ignored, field) {
      return getFormValueSetter(field);
    }
  };
  var getters = form;
  var setters = new Proxy({}, settersHandler);
  return [getters, setters, utils];
};

var _default = useFormValues;
exports.default = _default;