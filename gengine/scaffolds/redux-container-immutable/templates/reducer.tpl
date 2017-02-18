/**
 * <%= componentName %>Reducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';
import { SAMPLE_ACTION } from './constants';

// The initial state of the App
const initialState = fromJS({
    name: 'Sample Name',
});

function <%= _.camelCase(componentName) %>Reducer(state = initialState, action) {
    switch (action.type) {
        case SAMPLE_ACTION:
            return state.set('name', action.name);
        default:
            return state;
    }
}

export default <%= _.camelCase(componentName) %>Reducer;
