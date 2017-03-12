import { forOwn, isObject, isString, extend, difference, keys, isEqual } from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import components from '../../app/components.js';

function wrapComponent(WrappedComponent, props) {
	const { onMouseDown, initialState, key, type } = props;
	const myName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
	var klass = React.createClass({
		subscribeToInitialState(){
			if(initialState){
				initialState.elements[key] = {
					getDOMNode: () => {
						this.initDOMNode();
						return this.$DOMNode[0];
					}
				}
			}
		},
		initDOMNode(){
			if(!this.$DOMNode){
				this.$DOMNode = $(ReactDOM.findDOMNode(this));
				this.$DOMNode
					.on('mousedown', this.handleMouseDown)
					.on('mouseover', this.handleMouseOver)
					.on('mouseout', this.handleMouseOut)
					.on('click', this.handleNoop)
					.on('doubleclick', this.handleNoop)
					.on('mouseup', this.handleNoop);
			}
		},
		componentWillMount(){
			this.subscribeToInitialState();
		},
		componentDidMount(){
			this.initDOMNode();
		},
		componentWillUnmount(){
			if(this.$DOMNode){
				this.$DOMNode
					.off('mousedown')
					.off('mouseover')
					.off('mouseout')
					.off('click')
					.off('doubleclick')
					.off('mouseup');
			}
			this.$DOMNode = undefined;
		},
		componentWillReceiveProps(nextProps){
			this.subscribeToInitialState();
		},
		handleMouseDown(e){
			if(!e.shiftKey){
				e.stopPropagation();
				e.preventDefault();
				if(onMouseDown){
					onMouseDown(key, e.metaKey || e.ctrlKey);
				}
			}
		},
		handleMouseOver(e){
			if(initialState && initialState.onMouseOver){
				this.initDOMNode();
				initialState.onMouseOver({ targetDOMNode: this.$DOMNode[0], type, key});
			}
		},
		handleMouseOut(e){
			if(initialState && initialState.onMouseOut){
				this.initDOMNode();
				initialState.onMouseOut({ targetDOMNode: this.$DOMNode[0], remove: true});
			}
		},
		handleNoop(e){
			if(!e.shiftKey) {
				e.stopPropagation();
				e.preventDefault();
			}
		},
		render: function(){
			return <WrappedComponent {...this.props} />;
		}
	});
	klass.displayName = myName;
	return klass;
}

export function findComponent(index, componentName, namespace) {
	let result = undefined;
	if (index) {
		if (componentName && namespace) {
			result = index[namespace][componentName];
		} else if (componentName) {
			result = index[componentName];
		}
	}
	if (!result) {
		result = componentName || 'div';
	}
	return result;
}

export function createElement(node, initialState, mouseDownHandler, options){

	let modelNode = node.modelNode;
	let type = findComponent(components, modelNode.type, modelNode.namespace);
	let props = extend({}, modelNode.props, {key: node.key});

	if(node.props){
		forOwn(node.props, (prop, propName) => {
			props[propName] = createElement(prop, initialState, mouseDownHandler, options);
		});
	}

	let nestedElements = null;

	if(node.children && node.children.length > 0){
		let children = [];
		node.children.forEach(node => {
			children.push(createElement(node, initialState, mouseDownHandler, options));
		});
		nestedElements = children;
	} else if(modelNode.text) {
		nestedElements = [modelNode.text];
	}

	let result = null;
	try{
		if(options.isEditModeOn){
			const wrapperProps = {
				onMouseDown: mouseDownHandler,
				key: node.key,
				type: modelNode.type,
				initialState: initialState
			};
			result = React.createElement(wrapComponent(type, wrapperProps), props, nestedElements);
		} else {
			result = React.createElement(type, props, nestedElements);
		}
		if(result.type.prototype){
			if(result.type.prototype.render){
				result.type.prototype.render = ((fn) => {
					return function render(){
						try {
							return fn.apply(this, arguments);
						} catch (err) {
							console.error(err);
							return React.createElement('div', {
								style: {
									width: '100%',
									height: '100%',
									backgroundColor: '#c62828',
									color: 'white',
									padding: '3px',
									display: 'table'
								}
							}, React.createElement('span', {
								style: {
									display: 'table-cell',
									verticalAlign: 'middle'
								}
							}, '\'' + modelNode.type + '\' ' + err.toString()));
						}
					}
				})(result.type.prototype.render);
			}
		}

	} catch(e){
		console.error('Element type: ' + modelNode.type + ' is not valid React Element. Please check your components.js file. ' + e);
	}
	return result;
}

export function createElements(model, initialState, mouseDownHandler, options){
	initialState.elements = {};
	let elements = [];
	if(model && model.children && model.children.length > 0){
		model.children.forEach(child => {
			elements.push(createElement(child, initialState, mouseDownHandler, options));
		});
	}
	return elements;
}
