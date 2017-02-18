/**
 * <%= componentName %> selectors
 */

import { createSelector } from 'reselect';

/**
 * Direct selector to the <%= metadata.reducerKeyProperty %> state domain
 */
const select<%= _.capitalize(metadata.reducerKeyProperty) %> = () => (state) => state.get('<%= metadata.reducerKeyProperty %>');

/**
 * Other specific selectors
 */
const selectName = () => createSelector(
    select<%= _.capitalize(metadata.reducerKeyProperty) %>(),
    (<%= metadata.reducerKeyProperty %>State) => <%= metadata.reducerKeyProperty %>State.get('name')
);

export default select<%= _.capitalize(metadata.reducerKeyProperty) %>;

export {
    selectName
};
