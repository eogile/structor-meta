import expect from 'expect';
import thirdTestContainerReducer from '../reducer';
import { fromJS } from 'immutable';

describe('thirdTestContainerReducer', () => {
  it('returns the initial state', () => {
    expect(thirdTestContainerReducer(undefined, {})).toEqual(fromJS({
      name: 'Sample Name'
    }));
  });
});
