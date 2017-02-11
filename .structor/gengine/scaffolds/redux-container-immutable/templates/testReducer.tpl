import expect from 'expect';
import <%= _.camelCase(componentName) %>Reducer from '../reducer';
import { fromJS } from 'immutable';

describe('<%= _.camelCase(componentName) %>Reducer', () => {
    it('returns the initial state', () => {
        expect(<%= _.camelCase(componentName) %>Reducer(undefined, {})).toEqual(fromJS({ name: 'Sample Name' }));
    });
});
