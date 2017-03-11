/**
 * <%= componentName %> selectors
 */

import { createSelector } from 'reselect';

/**
 * Direct selector to the <%= metadata.reducerKeyProperty %> state domain
 */
const select<%= _.capitalize(metadata.reducerKeyProperty) %> = () => (state) => state.<%= metadata.reducerKeyProperty %>;

/**
 * Other specific selectors
 */
const selectName = () => createSelector(
    select<%= _.capitalize(metadata.reducerKeyProperty) %>(),
    (<%= metadata.reducerKeyProperty %>State) => <%= metadata.reducerKeyProperty %>State.name
);

export default select<%= _.capitalize(metadata.reducerKeyProperty) %>;

export {
    selectName
};
