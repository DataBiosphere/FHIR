import { take, call, put, select, getContext } from 'redux-saga/effects';

// Individual exports for testing
export default function* capabilitySaga() {
  console.log(getContext('fhirclient'));
  // See example in containers/HomePage/saga.js
}
