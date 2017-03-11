import path from 'path';
import {has, get, camelCase, findIndex} from 'lodash';
import {commons} from 'structor-commons';

export function getFile(dataObject, dependencies){

    const {index, model, metadata, project, namespace, componentName} = dataObject;

    if (namespace && namespace.length > 0) {
        let sourceCode;
        const module = index.modules[namespace];
        const relativeFilePath = './' + path.join('components', componentName);
        if (module) {
            if (module.indexFilePath && module.indexSourceCode) {
                let ast = commons.parse(module.indexSourceCode);
                ast = commons.addDefaultImport(ast, componentName, relativeFilePath);
                ast = commons.addNamedExport(ast, componentName);
                sourceCode = commons.generate(ast);
            } else {
                throw Error('Module components index file was not found.');
            }
        } else {
            sourceCode =
                `import ${componentName} from '${relativeFilePath}';
                
                export {
                    ${componentName}
                };
                `;
        }
        return {
            outputFilePath: module.indexFilePath,
            sourceCode,
        }
    }
    return {};
}
