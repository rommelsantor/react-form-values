# `react-form-values`

This is a custom React hook that simplifies how you can control the state of form fields using a clean and reasonable syntax.

## Install

```sh
npm i react-form-values
```

Prerequisite: `npm i react@^16.8.0 react-dom@^16.8.0`

## API

`useFormValues()` accepts two parameters:

1. `initialValues` object - the initial field name/value pairs that serve as the baseline for the form
1. `onFormChange` function(object) - callback executed with object of name/value pairs whenever any field changes

`useFormValues()` returns an array with three elements:

1. `formValues` object - form field name keys mapped to their current values
1. `formSetters` object - form field name keys mapped to setter function (also appropriate for assignment via `onChange`)
1. `utilities` object with the following properties:
  * `clear` function - call this to clear all form fields with a blank value (`''`)
  * `isDirty` boolean - true if any `formValues` differ at all from `initialValues`
  * `reset` function - call this to reset the form to the `initialValues`

Note: the properties in `formSetters` can be called by your code arbitrarily with an arbitrary value (it is not required that it only be passed to `onChange` or an `Event` object). For example:

```js
formSetters.phoneNumber('949.555.1212') // this will change the value of formValues.phoneNumber
```

## Usage

### Basic example

```js
import useFormValues from 'react-form-values'

const MyUserForm = props => {
  const [formValues, formSetters] = useFormValues()

  const onSubmit = event => {
    event.preventDefault()

    console.log('Want to submit form values:', formValues)
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        onChange={formSetters.name}
        value={formValues.name}
      />

      <input
        onChange={formSetters.email}
        value={formValues.email}
      />

      <button type="submit">
        Submit
      </button>
    </form>
  )
}
```

### Pre-populating form, dirty checking, clear, and reset

```js
import useFormValues from 'react-form-values'

const userPreviouslyLoadedViaApi = {
  id: 12345,
  name: 'James Mercer',
  email: 'the.shins@new-slang.example',
}

const MyUserForm = props => {
  // third returned element is utilities object
  const [formValues, formSetters, utils] = useFormValues(userPreviouslyLoadedViaApi)

  const onMakeBlank = () => {
    utils.clear()
  }

  const onReset = () => {
    if (utils.isDirty) {
      if (!window.confirm('Your changes to the user will be lost - continue with reset?')) {
        return
      }

      utils.reset()
    }
  }

  return (
    <div>
      <input
        onChange={formSetters.name}
        value={formValues.name}
      />

      <br />

      <input
        onChange={formSetters.email}
        value={formValues.email}
      />

      <br />

      <button
        onClick={onMakeBlank}
        type="button"
      >
        Clear
      </button>

      &nbsp;

      <button
        onClick={onReset}
        type="button"
      >
        Reset
      </button>
    </div>
  )
}
```
