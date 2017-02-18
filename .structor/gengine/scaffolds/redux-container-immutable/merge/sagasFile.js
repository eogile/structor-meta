'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectSaga = injectSaga;
exports.getFile = getFile;

var _lodash = require('lodash');

var _structorCommons = require('structor-commons');

var _structorCommons2 = _interopRequireDefault(_structorCommons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function appendToNode(node, identifier) {
    if (node.type === 'ArrayExpression') {
        if (node.elements) {
            var existing = node.elements.find(function (e) {
                return e.argument && e.argument.name === identifier;
            });
            if (!existing) {
                node.elements.push({
                    type: 'SpreadElement',
                    argument: {
                        type: 'Identifier',
                        name: identifier
                    }
                });
            } else {
                throw Error('Identifier with ' + existing.argument.name + ' name is already used for sagas. \n                    Check ./structor/app/sagas.js file.');
            }
        }
    } else {
        throw Error('Online generator. The default export in "./structor/app/sagas.js" file is not array.');
    }
}

function deleteFromNode(defaultNode, identifier) {
    if (defaultNode.type === 'ArrayExpression') {
        if (defaultNode.elements) {
            if (defaultNode.elements.length > 0) {
                var foundIndex = -1;
                for (var i = 0; i < defaultNode.elements.length; i++) {
                    var argument = defaultNode.elements[i].argument;

                    if (argument && argument.name === identifier) {
                        foundIndex = i;
                    }
                }
                if (foundIndex >= 0) {
                    defaultNode.elements.splice(foundIndex, 1);
                    deleteFromNode(defaultNode, identifier);
                }
            }
        }
    } else {
        throw Error('The default export in "./structor/app/sagas.js" file is not array.');
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

function injectImport(ast, identifier, sourcePath) {
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
        appendToNode(defaultNodeAst, identifier);
    } else {
        throw Error('Could not find default export in "./structor/app/sagas.js" file.');
    }
}

function injectSaga(ast, componentGroup, componentName, reducerKeyProperty) {
    var identifier = reducerKeyProperty + 'Sagas';
    var sourcePath = 'containers/' + componentGroup + '/' + componentName + '/sagas.js';
    injectImport(ast, identifier, sourcePath);
    return _structorCommons2.default.generate(ast);
}

function getFile(dataObject, dependencies) {
    var index = dataObject.index,
        model = dataObject.model,
        metadata = dataObject.metadata,
        project = dataObject.project,
        groupName = dataObject.groupName,
        componentName = dataObject.componentName;


    if (!(0, _lodash.has)(project, 'paths.deskSagasFilePath')) {
        throw Error('Wrong project configuration. "deskSagasFilePath" field is missing.');
    }

    var ast = _structorCommons2.default.parse(project.sources['deskSagasFile']);

    return {
        outputFilePath: project.paths.deskSagasFilePath,
        sourceCode: injectSaga(ast, groupName, componentName, metadata.reducerKeyProperty)
    };
}