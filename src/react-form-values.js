import { useEffect, useState } from 'react'
import get from 'lodash.get'
import has from 'lodash.has'
import isEqual from 'lodash.isequal'

const normalizeEmptyValues = input => {
  const output = {}

  Object.entries(input).forEach(([key, value]) => output[key] = value || '')

  return output
}

// returns 3-element array:
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
const useFormValues = (initialValues_, onFormChange) => {
  const initialValues = normalizeEmptyValues(initialValues_ || {})

  const [form, setFormValues] = useState({})
  const [initials, setInitials] = useState(initialValues || {})
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (!isEqual(initialValues, initials)) {
      setInitials(initialValues)
      setFormValues(initialValues)
    }
  }, [initialValues])

  useEffect(() => {
    setIsDirty(!isEqual(initials, form))
  }, [initials, form])

  const getFormValueSetter = fieldName =>
    value_ =>
      setFormValues(prevForm => {
        const didReceiveEvent = typeof value_ === 'object' && has(value_, 'target.value')

        const value = didReceiveEvent
          ? get(value_, 'target.value')
          : value_

        const newForm = { ...prevForm, [fieldName]: value }

        if (onFormChange) {
          onFormChange(newForm)
        }

        return newForm
      })

  const rollback = eraseValues => {
    const newForm = {}

    Object.keys(initials).forEach(
      field => newForm[field] = eraseValues ? '' : initials[field] || ''
    )

    setFormValues(newForm)

    if (onFormChange) {
      onFormChange(newForm)
    }
  }

  const reset = () => {
    rollback(false)
  }

  const clear = () => {
    rollback(true)
  }

  const utils = {
    clear,
    isDirty,
    reset,
  }

  const settersHandler = {
    get(ignored, field) {
      return getFormValueSetter(field)
    },
  }

  const getters = form

  const setters = new Proxy({}, settersHandler)

  return [
    getters,
    setters,
    utils,
  ]
}

export default useFormValues
