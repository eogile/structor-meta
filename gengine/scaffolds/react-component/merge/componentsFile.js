import {has, get, camelCase, findIndex} from 'lodash';
import { parse, generate, traverse } from 'structor-commons';

function injectImport(ast, componentGroup, componentName){
    let foundIndex = -1;
    let injectIndex = -1;
    const sourcePath = `components/${componentGroup}/${componentName}`;
    for(let i = 0; i < ast.body.length; i++){
        const {type, specifiers, source} = ast.body[i];
        if(type === 'ImportDeclaration'){
            injectIndex = i;
            if(source && source.value === sourcePath){
                foundIndex = i;
            }
        }
    }
    if(foundIndex < 0){
        ast.body.splice(injectIndex >= 0 ? injectIndex + 1 : 0, 0, {
            type: 'ImportDeclaration',
            specifiers: [
                {
                    type: "ImportDefaultSpecifier",
                    local: {
                        type: "Identifier",
                        name: componentName
                    }
                }
            ],
            source: {
                type: "Literal",
                value: sourcePath,
                raw: '\'' + sourcePath + '\''
            }
        });
        return true;
    }
    return false;
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

function appendToNode(node, variableString) {
    var newAst = parse('var c = {' + variableString + '}');
    var newPart = null;
    traverse(newAst, node => {
        if (node.type === 'VariableDeclarator' && node.id.name === 'c') {
            newPart = node.init.properties[0];
        }
    });
    if (node.properties) {
        let index = -1;
        if (node.properties.length > 0) {
            index = findIndex(node.properties, (o) => {
                return (o.key && o.key.type === 'Identifier' && o.key.name === newPart.key.name);
            });
        }
        if (index >= 0) {
            node.properties[index] = newPart;
        } else {
            node.properties.push(
                newPart
            );
        }
    }
}

export function injectComponent(ast, componentGroup, componentName) {
    const defaultNodeAst = findDefaultExportNode(ast);
    if (defaultNodeAst) {
        if (injectImport(ast, componentGroup, componentName)) {
            let groupNode = null;
            traverse(defaultNodeAst, node => {
                if (node.type === 'Property' && node.key.type === 'Identifier') {
                    if (node.value.type === 'ObjectExpression' && node.key.name === componentGroup) {
                        groupNode = node.value;
                    }
                }
            });
            if (!groupNode) {
                appendToNode(defaultNodeAst, componentGroup + ': {' + componentName + '}');
            } else {
                appendToNode(groupNode, componentName);
            }
        }
    } else {
        throw Error('Could not find default export in "./structor/app/components.js" file.');
    }
    return generate(ast);
}

export function getFile(dataObject, dependencies){

    const {index, model, metadata, project, groupName, componentName} = dataObject;

    if(!has(project, 'paths.deskIndexFilePath')){
        throw Error('Wrong project configuration. \'deskIndexFilePath\' field is missing.');
    }

    let ast = parse(project.sources['deskIndexFile']);

    return {
        outputFilePath: project.paths.deskIndexFilePath,
        sourceCode: injectComponent(ast, groupName, componentName)
    }
}
