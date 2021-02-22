/*
 *
 * Capability reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, LOAD_CAPABILITY_STATEMENT } from './constants';

export const initialState = {
  container: 'Capability',
};

/* eslint-disable default-case, no-param-reassign */
const capabilityReducer = (state = initialState, action: any) =>
  produce(state, (draft: any) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case LOAD_CAPABILITY_STATEMENT:
        draft.metadata = action.payload;
        break;
    }
  });

export default capabilityReducer;
