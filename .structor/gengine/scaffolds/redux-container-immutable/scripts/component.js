/**
 * Created by Alexander Pustovalov on 4/8/16.
 */

import {forOwn, template, has} from 'lodash';
import path from 'path';
import { formatJs, getModelComponentMap } from 'structor-market-gengine-commons';

function repairPath(path){
    if(path.substr(0, 1) !== '.'){
        path = './' + path;
    }
    return path;
}


export function getFile(dataObject, templateText){

    const {index, model, metadata, project, groupName, componentName} = dataObject;

    if(!has(project, 'paths.appDirPath')){
        throw Error('Wrong project configuration. \'appDirPath\' field is missing.');
    }

    let modelComponentMap = getModelComponentMap(model);


    let imports = [];
    const absoluteComponentDirPath = path.join(project.paths.appDirPath, 'containers', groupName, componentName);
    const absoluteComponentFilePath = path.join(absoluteComponentDirPath, 'index.js');

    let importItem;

    if(index.groups){
        forOwn(index.groups, (value, prop) => {
            if(value.components && value.components.length > 0){
                value.components.forEach((componentInIndex) => {
                    if(componentInIndex.name !== componentName && modelComponentMap[componentInIndex.name]){
                        importItem = {
                            name: componentInIndex.name,
                            member: componentInIndex.member,
                            relativeSource: componentInIndex.source
                        };
                        imports.push(importItem);
                    }
                });
            }
        });
    }

    const templateObject = {
        model, imports, groupName, componentName, metadata
    };

    let resultSource;
    try{
        resultSource = template(templateText)(templateObject);
        resultSource = resultSource.replace(/(^\s*[\r\n]){2,}/gm, "\n");
    } catch(e){
        throw Error('Online generator. lodash template error. ' + e);
    }

    try{
        resultSource = formatJs(resultSource);
    } catch (e){
        throw Error('Online generator. JavaScript syntax error. ' + e + '\n[Source code:]\n' + resultSource);
    }

    return {
        outputFilePath: absoluteComponentFilePath,
        sourceCode: resultSource,
        isComponent: true
    };
}
