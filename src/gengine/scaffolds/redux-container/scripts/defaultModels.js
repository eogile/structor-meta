import {forOwn, template, has} from 'lodash';
import path from 'path';

function repairPath(path){
    if(path.substr(0, 1) !== '.'){
        path = './' + path;
    }
    return path;
}


export function getFile(dataObject, templateText){

    const {model, metadata, project, groupName, componentName} = dataObject;

    if(!has(project, 'paths.componentDefaultsDirPath')){
        throw Error('Wrong project configuration. \'componentDefaultsDirPath\' field is missing.');
    }

    const absoluteFilePath = path.join(project.paths.componentDefaultsDirPath, componentName + '.json');

    const templateObject = {
        groupName, componentName, metadata, model
    };

    let resultSource;
    try{
        resultSource = template(templateText)(templateObject);
    } catch(e){
        throw Error('lodash template error. ' + e);
    }

    let defaults = [];
    try {
        defaults = JSON.parse(resultSource);
    } catch (e) {
        throw Error('Parsing default models JSON error. ' + e);
    }

    return {
        outputFilePath: absoluteFilePath,
        sourceCode: JSON.stringify(defaults),
        isComponent: false
    };
}
