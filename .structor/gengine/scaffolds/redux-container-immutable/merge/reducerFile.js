'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectReducer = injectReducer;
exports.getFile = getFile;

var _lodash = require('lodash');

var _structorCommons = require('structor-commons');

var _structorCommons2 = _interopRequireDefault(_structorCommons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function appendToNode(node, property, identifier) {
    if (node.type === 'ObjectExpression') {
        if (node.properties) {
            var existing = node.properties.find(function (p) {
                return p.key && p.key.name === property;
            });
            if (!existing) {
                node.properties.push({
                    type: 'Property',
                    key: {
                        type: 'Identifier',
                        name: property
                    },
                    computed: false,
                    value: {
                        type: 'Identifier',
                        name: identifier
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
                });
            } else {
                throw Error('Property with "' + property + '" name belongs to another reducer: ' + existing.value.name + '. \n                    Check ./structor/app/reducers.js file.');
            }
        }
    } else {
        throw Error('The default export in "./structor/app/reducers.js" file is not object.');
    }
}

function deleteFromNode(defaultNode, identifier) {
    if (defaultNode.type === 'ObjectExpression') {
        if (defaultNode.properties) {
            if (defaultNode.properties.length > 0) {
                var foundIndex = -1;
                for (var i = 0; i < defaultNode.properties.length; i++) {
                    var value = defaultNode.properties[i].value;

                    if (value && value.name === identifier) {
                        foundIndex = i;
                    }
                }
                if (foundIndex >= 0) {
                    defaultNode.properties.splice(foundIndex, 1);
                    deleteFromNode(defaultNode, identifier);
                }
            }
        }
    } else {
        throw Error('The default export in "./structor/app/reducers.js" file is not object.');
    }
}

function removeImport(ast, defaultNode, sourcePath) {
    var foundIndex = -1;
    var foundIdentifier = undefined;
    var injectIndex = -1;
    for (var i = 0; i < ast.body.length; i++) {
        var _ast$body$i = ast.body[i],
            type = _ast$body$i.type,
            source = _ast$body$i.source,
            specifiers = _ast$body$i.specifiers;

        if (type === 'ImportDeclaration') {
            injectIndex = i;
            if (source && source.value === sourcePath) {
                foundIndex = i;
                if (specifiers && specifiers.length > 0) {
                    var importDefaultSpecifier = specifiers.find(function (i) {
                        return i.type && i.type === 'ImportDefaultSpecifier' && i.local;
                    });
                    if (importDefaultSpecifier) {
                        foundIdentifier = importDefaultSpecifier.local.name;
                    }
                }
                break;
            }
        }
    }
    if (foundIndex >= 0) {
        ast.body.splice(foundIndex, 1);
        if (foundIdentifier) {
            deleteFromNode(defaultNode, foundIdentifier);
        }
        return removeImport(ast, defaultNode, sourcePath);
    } else {
        return injectIndex;
    }
}

function findDefaultExportNode(ast) {
    var exports = null;
    _structorCommons2.default.traverse(ast, function (node) {
        if (node.type === 'ExportDefaultDeclaration') {
            exports = node.declaration;
        }
    });
    return exports;
}

function injectImport(ast, property, identifier, sourcePath) {
    var defaultNodeAst = findDefaultExportNode(ast);
    if (defaultNodeAst) {
        var injectIndex = removeImport(ast, defaultNodeAst, sourcePath);
        ast.body.splice(injectIndex >= 0 ? injectIndex + 1 : 0, 0, {
            type: 'ImportDeclaration',
            specifiers: [{
                type: "ImportDefaultSpecifier",
                local: {
                    type: "Identifier",
                    name: identifier
                }
            }],
            source: {
                type: "Literal",
                value: sourcePath,
                raw: '\'' + sourcePath + '\''
            }
        });
        appendToNode(defaultNodeAst, property, identifier);
    } else {
        throw Error('Could not find default export in "./structor/app/reducers.js" file.');
    }
}

function injectReducer(ast, componentGroup, componentName, reducerKeyProperty) {
    var property = reducerKeyProperty;
    var identifier = reducerKeyProperty + 'Reducer';
    var sourcePath = 'containers/' + componentGroup + '/' + componentName + '/reducer.js';
    injectImport(ast, property, identifier, sourcePath);
    return _structorCommons2.default.generate(ast);
}

function getFile(dataObject, dependencies) {
    var index = dataObject.index,
        model = dataObject.model,
        metadata = dataObject.metadata,
        project = dataObject.project,
        groupName = dataObject.groupName,
        componentName = dataObject.componentName;


    if (!(0, _lodash.has)(project, 'paths.deskReducersFilePath')) {
        throw Error('Wrong project configuration. "deskReducersFilePath" field is missing.');
    }

    var ast = _structorCommons2.default.parse(project.sources['deskReducersFile']);

    return {
        outputFilePath: project.paths.deskReducersFilePath,
        sourceCode: injectReducer(ast, groupName, componentName, metadata.reducerKeyProperty)
    };
}