import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from 'modules/<%= namespace %>/reducer';
import sagas from 'modules/<%= namespace %>/sagas';

const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => (noop) => noop);

const createReducers = (asyncReducers) => {
	return combineReducers({
		...asyncReducers,
	});
};

export default function configureStore(initialState = {}) {

	const middlewares = [
		sagaMiddleware,
	];

	const enhancers = [
		applyMiddleware(...middlewares),
		devtools(),
	];

	const store = createStore(
		createReducers(reducers),
		initialState,
		compose(...enhancers)
	);

	sagas.map(sagaMiddleware.run);

	return store;
}
