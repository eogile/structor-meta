import {has, get, camelCase, findIndex} from 'lodash';
import { parse, generate, traverse } from 'structor-market-gengine-commons';

function appendToNode(node, property, identifier) {
    if(node.type === 'ObjectExpression'){
        if(node.properties){
            let existing = node.properties.find(p => p.key && p.key.name === property);
            if(!existing) {
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
                throw Error(
                    `Online generator. 
                    Property with "${property}" name belongs to another reducer: ${existing.value.name}. 
                    Check ./structor/app/reducers.js file.`
                );
            }
        }
    } else {
        throw Error('Online generator. The default export in "./structor/app/reducers.js" file is not object.');
    }
}

function deleteFromNode(defaultNode, identifier) {
    if(defaultNode.type === 'ObjectExpression'){
        if(defaultNode.properties){
            if(defaultNode.properties.length > 0) {
                let foundIndex = -1;
                for(let i = 0; i < defaultNode.properties.length; i++){
                    const {value} = defaultNode.properties[i];
                    if(value && value.name === identifier){
                        foundIndex = i;
                    }
                }
                if(foundIndex >= 0) {
                    defaultNode.properties.splice(foundIndex, 1);
                    deleteFromNode(defaultNode, identifier);
                }
            }
        }
    } else {
        throw Error('Online generator. The default export in "./structor/app/reducers.js" file is not object.');
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

function injectImport(ast, property, identifier, sourcePath){
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
        appendToNode(defaultNodeAst, property, identifier);
    } else {
        throw Error('Online generator. Could not find default export in "./structor/app/reducers.js" file.');
    }
}

export function injectReducer(ast, componentGroup, componentName, reducerKeyProperty) {
    const property = reducerKeyProperty;
    const identifier = reducerKeyProperty + 'Reducer';
    const sourcePath = `containers/${componentGroup}/${componentName}/reducer.js`;
    injectImport(ast, property, identifier, sourcePath);
    return generate(ast);
}

export function getFile(dataObject, dependencies){

    const {index, model, metadata, project, groupName, componentName} = dataObject;

    if(!has(project, 'paths.deskReducersFilePath')){
        throw Error('Wrong project configuration. "deskReducersFilePath" field is missing.');
    }

    let ast = parse(project.sources['deskReducersFile']);

    return {
        outputFilePath: project.paths.deskReducersFilePath,
        sourceCode: injectReducer(ast, groupName, componentName, metadata.reducerKeyProperty)
    }
}
