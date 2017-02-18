import {has, get, camelCase, findIndex} from 'lodash';
import { parse, generate, traverse } from 'structor-commons';

function appendToNode(node, identifier) {
    if(node.type === 'ArrayExpression'){
        if(node.elements){
            let existing = node.elements.find(e => e.argument && e.argument.name === identifier);
            if(!existing) {
                node.elements.push({
                    type: 'SpreadElement',
                    argument: {
                        type: 'Identifier',
                        name: identifier
                    }
                });
            } else {
                throw Error(
                    `Identifier with ${existing.argument.name} name is already used for sagas. 
                    Check ./structor/app/sagas.js file.`
                );
            }
        }
    } else {
        throw Error('Online generator. The default export in "./structor/app/sagas.js" file is not array.');
    }
}

function deleteFromNode(defaultNode, identifier) {
    if(defaultNode.type === 'ArrayExpression'){
        if(defaultNode.elements){
            if(defaultNode.elements.length > 0) {
                let foundIndex = -1;
                for(let i = 0; i < defaultNode.elements.length; i++) {
                    const {argument} = defaultNode.elements[i];
                    if(argument && argument.name === identifier) {
                        foundIndex = i;
                    }
                }
                if(foundIndex >= 0) {
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
    let foundIndex = -1;
    let foundIdentifier = undefined;
    let injectIndex = -1;
    for(let i = 0; i < ast.body.length; i++){
        const {type, source, specifiers} = ast.body[i];
        if(type === 'ImportDeclaration'){
            injectIndex = i;
            if(source && source.value === sourcePath){
                foundIndex = i;
                if(specifiers && specifiers.length > 0) {
                    let importDefaultSpecifier =
                        specifiers.find(i =>
                        i.type &&
                        i.type === 'ImportDefaultSpecifier'
                        && i.local);
                    if(importDefaultSpecifier) {
                        foundIdentifier = importDefaultSpecifier.local.name;
                    }
                }
                break;
            }
        }
    }
    if(foundIndex >= 0) {
        ast.body.splice(foundIndex, 1);
        if(foundIdentifier) {
            deleteFromNode(defaultNode, foundIdentifier);
        }
        return removeImport(ast, defaultNode, sourcePath);
    } else {
        return injectIndex;
    }
}

function findDefaultExportNode(ast){
    let exports = null;
    traverse(ast, node => {
        if(node.type === 'ExportDefaultDeclaration'){
            exports = node.declaration;
        }
    });
    return exports;
}

function injectImport(ast, identifier, sourcePath){
    const defaultNodeAst = findDefaultExportNode(ast);
    if(defaultNodeAst) {
        let injectIndex = removeImport(ast, defaultNodeAst, sourcePath);
        ast.body.splice(injectIndex >= 0 ? injectIndex + 1 : 0, 0, {
            type: 'ImportDeclaration',
            specifiers: [
                {
                    type: "ImportDefaultSpecifier",
                    local: {
                        type: "Identifier",
                        name: identifier
                    }
                }
            ],
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

export function injectSaga(ast, componentGroup, componentName, reducerKeyProperty) {
    const identifier = reducerKeyProperty + 'Sagas';
    const sourcePath = `containers/${componentGroup}/${componentName}/sagas.js`;
    injectImport(ast, identifier, sourcePath);
    return generate(ast);
}

export function getFile(dataObject, dependencies){

    const {index, model, metadata, project, groupName, componentName} = dataObject;

    if(!has(project, 'paths.deskSagasFilePath')){
        throw Error('Wrong project configuration. "deskSagasFilePath" field is missing.');
    }

    let ast = parse(project.sources['deskSagasFile']);

    return {
        outputFilePath: project.paths.deskSagasFilePath,
        sourceCode: injectSaga(ast, groupName, componentName, metadata.reducerKeyProperty)
    }
}
