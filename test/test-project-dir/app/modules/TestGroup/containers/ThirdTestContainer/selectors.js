/**
 * ThirdTestContainer selectors
 */

import { createSelector } from 'reselect';

/**
 * Direct selector to the containerComponent state domain
 */
const selectContainercomponent = () => (state) => state.containerComponent;

/**
 * Other specific selectors
 */
const selectName = () => createSelector(
  selectContainercomponent(),
  (containerComponentState) => containerComponentState.name
);

export default selectContainercomponent;

export { selectName };
