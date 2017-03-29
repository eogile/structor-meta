<%

function getComponentClassMemberImports(imports) {
    var result = '';
    var importsMap = {};
    imports.forEach(function(item) {
        if (item.member) {
            importsMap[item.relativeSource] = importsMap[item.relativeSource] || [];
            importsMap[item.relativeSource].push(item.name);
        }
    });
    var joined;
    _.forOwn(importsMap, function(members, relativeSource){
        joined = members.join(',');
        result += 'import {' + joined + '} from \'' + relativeSource  + '\';\n';
    });
    return result;
}

function getComponentClassNamespaceImports(imports){
    var result = '';
    var importsMap = {};
    imports.forEach( function(item) {
        if(item.namespace){
            importsMap[item.relativeSource] = importsMap[item.relativeSource] || [];
            importsMap[item.relativeSource].push(item.name);
        }
    });
    _.forOwn(importsMap, function(name, relativeSource){
        result += 'import * as ' + name + ' from \'' + relativeSource + '\';\n';
    });
    return result;
}

function getComponentClassDefaultImports(imports){
    var result = '';
    var importsMap = {};
    imports.forEach( function(item) {
        if(!item.member && !item.namespace){
            importsMap[item.relativeSource] = importsMap[item.relativeSource] || [];
            importsMap[item.relativeSource].push(item.name);
        }
    });
    _.forOwn(importsMap, function(name, relativeSource){
        result += 'import ' + name + ' from \'' + relativeSource + '\';\n';
    });
    return result;
}

function processChild(model) {
    var result = '<' + model.type + (_.isEmpty(model.props) ? '' : ' ' + processProps(model.props)) + '>';
    if (model.children && model.children.length > 0) {
        _.forEach(model.children, function (child) {
            result += processChild(child);
        });
    } else if (model.text && model.text.length > 0) {
        result += model.text;
    }
    result += '</' + model.type + '>';
    return result;
}

function processStyle(styleObject) {
    var result = '';
    if (styleObject && !_.isEmpty(styleObject)) {
        _.forOwn(styleObject, function (value, prop) {
            if (_.isString(value) && value.length > 0) {
                result += ' ' + prop + ": '" + value + "',";
            } else if (_.isBoolean(value) || _.isNumber(value)) {
                result += ' ' + prop + ": " + value + ",";
            }
        });
        result = result.substr(0, result.length - 1);
    }
    return result;
}

function processProps(props) {

    var result = '';
    if (props && !_.isEmpty(props)) {
        _.forOwn(props, function (value, prop) {
            if (_.isString(value) && value.length > 0) {
                result += prop + "=\"" + value + "\"";
            } else if (_.isBoolean(value) || _.isNumber(value)) {
                result += prop + "={" + value + "} ";
            } else if (_.isArray(value)) {
                var arrayString = '';
                _.forEach(value, function (item) {
                    if (_.isObject(item) && !_.isEmpty(item)) {
                        arrayString += '{ ' + processStyle(item) + ' },';
                    } else {
                        if (_.isString(item) && item.length > 0) {
                            arrayString += "\'" + item + "\',";
                        } else if (_.isBoolean(item) || _.isNumber(item)) {
                            arrayString += item + ',';
                        }
                    }
                });
                result += prop + '={[ ' + arrayString.substr(0, arrayString.length - 1) + ']}';
            } else if (_.isObject(value) && !_.isEmpty(value)) {
                if (value['type']) {
                    result += prop + "={ " + processChild(value) + " }";
                } else {
                    result += prop + "={{ " + processStyle(value) + " }} ";
                }
            }
        });
    }
    return result;
}
%>
/**
 *
 * <%= componentName %> Redux Container
 *
 */
<% if(metadata.componentType === 'ES6 Class (Pure)') { %>
import React, {PureComponent, PropTypes} from 'react';
<% } else if(metadata.componentType === 'ES6 Class') { %>
import React, {Component, PropTypes} from 'react';
<% } %>
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectName } from './selectors';
import { sampleAction } from './actions';
<% if(metadata.hasChildrenIncluded) { %><%= getComponentClassMemberImports(imports) %><%= getComponentClassDefaultImports(imports) %><%= getComponentClassNamespaceImports(imports) %><% } %>
<% if(metadata.componentType === 'ES6 Class (Pure)') { %>
class <%= componentName %> extends PureComponent { // eslint-disable-line react/prefer-stateless-function
<% } else if(metadata.componentType === 'ES6 Class') { %>
class <%= componentName %> extends Component { // eslint-disable-line react/prefer-stateless-function
<% } %>
    constructor(props) {
        super(props);
        this.handleEvent = this.handleEvent.bind(this);
        this.state = {
            exampleValue: '',
        };
    }

    handleEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        const {dispatch, name} = this.props; // eslint-disable-line
        dispatch(sampleAction(name));
    }

    render(){
        const { exampleValue } = this.state; // eslint-disable-line
        <% if(metadata.isPropertiesExample) {%>const { exampleProp } = this.props; // eslint-disable-line<%}%>
        return (
            <<%= (model.type === componentName ? 'div' : model.type) + (_.isEmpty(model.props) ? '' : ' ' + processProps(model.props)) %>>
                <% if(metadata.hasChildrenIncluded) { %>
                    <% if(model.children && model.children.length > 0) {
                        _.forEach(model.children, function(child) { %>
                            <%= processChild(child) %>
                        <% });
                    } %>
                <% } else { %>
                    <% if(model.children && model.children.length > 0) { %>
                        {this.props.children}
                    <% } %>
                <% } %>
            </<%= (model.type === componentName ? 'div' : model.type) %>>
        ); // eslint-disable-line
    }
}

<%= componentName %>.propTypes = {
    dispatch: PropTypes.func,
    name: PropTypes.string,
    <% if(metadata.isPropertiesExample) {%>exampleProp: PropTypes.string,<% } %>
    <% if(!metadata.hasChildrenIncluded) { %>children: PropTypes.node,<% } %>
};
<% if(metadata.isPropertiesExample || !metadata.hasChildrenIncluded) {%>
<%= componentName %>.defaultProps = {
    <% if(metadata.isPropertiesExample) {%>exampleProp: '',<% } %>
    <% if(!metadata.hasChildrenIncluded) { %>children: null,<% } %>
};
<%}%>

const mapStateToProps = createStructuredSelector({
    name: selectName(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(<%= componentName %>);
