import path from 'path';
import {gengine} from 'structor-commons';

export function getFile(dataObject, dependencies){

    const {index, model, metadata, project, namespace, componentName} = dataObject;

    if (!index.sagasSourceCode) {
        throw Error('Sagas source code was not found.');
    }

    let reducerFilePath;
    let sourceCode;
    if (namespace && namespace.length > 0) {
        reducerFilePath = path.join('modules', namespace, 'sagas.js');
        sourceCode = gengine.injectModuleSaga(
            index.sagasSourceCode,
            `${namespace}Sagas`,
            reducerFilePath
        );
    } else {
        reducerFilePath = path.join('containers', componentName, 'sagas.js');
        sourceCode = gengine.injectSaga(
            index.sagasSourceCode,
            `${componentName}Sagas`,
            reducerFilePath
        );
    }

    return {
        outputFilePath: index.sagasFilePath,
        sourceCode
    }
}
