import {forOwn, template, has} from 'lodash';
import path from 'path';
import {commons, gengine} from 'structor-commons';

export function getFile(dataObject, templateText){

    const {index, project, namespace} = dataObject;

    if(!has(project, 'paths.dir')){
        throw Error('Wrong project configuration. \'dir\' field is missing.');
    }

    let srcModel = gengine.combineAllModuleComponents(index, namespace);
    const modelComponentList = gengine.getModelComponentList(index, srcModel);
    if (modelComponentList && modelComponentList.length > 0) {
        const filtered = modelComponentList.filter(item => {
            return !item.namespace || item.namespace !== namespace;
        });
        console.log(JSON.stringify(filtered, null, 4));
        if (filtered && filtered.length > 0) {
            throw Error('Namespace models are including components from different namespaces.');
        }
    }
    const {imports, model} = gengine.prepareModelWithImports(index, srcModel, namespace);

    const absoluteComponentFilePath = path.join(project.paths.dir, '__sandbox', 'App.js');

    const templateObject = {
        model, imports, componentName: 'App'
    };

    let resultSource;
    try{
        resultSource = template(templateText)(templateObject);
    } catch(e){
        throw Error('lodash template error. ' + e);
    }

    try{
        resultSource = commons.formatJs(resultSource);
        resultSource = resultSource.replace(/(^\s*[\r\n]){2,}/gm, "\n");
    } catch (e){
        throw Error('JavaScript syntax error. ' + e + '\n[Source code:]\n' + resultSource);
    }

    return {
        outputFilePath: absoluteComponentFilePath,
        sourceCode: resultSource
    };

}
