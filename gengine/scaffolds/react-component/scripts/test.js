import {forOwn, template, has} from 'lodash';
import path from 'path';
import { formatJs } from 'structor-commons';

export function getFile(dataObject, templateText){

    const {index, model, metadata, project, groupName, componentName} = dataObject;

    if(!has(project, 'paths.appDirPath')){
        throw Error('Wrong project configuration. \'appDirPath\' field is missing.');
    }

    const absoluteComponentDirPath = path.join(project.paths.appDirPath, 'components', groupName, componentName, 'tests');
    const absoluteComponentFilePath = path.join(absoluteComponentDirPath, 'index.test.js');

    const templateObject = {
        model, groupName, componentName, metadata
    };

    let resultSource;
    try{
        resultSource = template(templateText)(templateObject);
    } catch(e){
        throw Error('lodash template error. ' + e);
    }

    try{
        resultSource = formatJs(resultSource);
        resultSource = resultSource.replace(/(^\s*[\r\n]){2,}/gm, "\n");
    } catch (e){
        throw Error('JavaScript syntax error. ' + e + '\n[Source code:]\n' + resultSource);
    }

    return {
        outputFilePath: absoluteComponentFilePath,
        sourceCode: resultSource
    };
}
