import {template, has} from 'lodash';
import path from 'path';

export function getFile(dataObject, templateText){

    const {metadata, project, groupName, componentName} = dataObject;

    if(!has(project, 'paths.docsComponentsDirPath')){
        throw Error('Wrong project configuration. \'docsComponentsDirPath\' field is missing.');
    }

    const absoluteFilePath = path.join(project.paths.docsComponentsDirPath, componentName + '.md');

    const templateObject = {
        groupName, componentName, metadata
    };

    let resultSource;
    try{
        resultSource = template(templateText)(templateObject);
    } catch(e){
        throw Error('lodash template error. ' + e);
    }

    return {
        outputFilePath: absoluteFilePath,
        sourceCode: resultSource,
        isComponent: false
    };
}
