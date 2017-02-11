import {template, has} from 'lodash';
import path from 'path';
import {formatJs} from 'structor-market-gengine-commons';

export function getFile(dataObject, templateText){

    const {model, metadata, project, groupName, componentName} = dataObject;

    if(!has(project, 'paths.appDirPath')){
        throw Error('Wrong project configuration. "appDirPath" field is missing.');
    }

    const absoluteComponentDirPath = path.join(project.paths.appDirPath, 'containers', groupName, componentName);
    const absoluteComponentFilePath = path.join(absoluteComponentDirPath, 'reducer.js');

    let resultSource;
    try{
        resultSource = template(templateText)({
            model, groupName, componentName, metadata
        });
    } catch(e){
        throw Error('Online generator. lodash template error. ' + e);
    }

    try{
        resultSource = formatJs(resultSource);
        resultSource = resultSource.replace(/(^\s*[\r\n]){2,}/gm, "\n");
    } catch (e){
        throw Error('Online generator. JavaScript syntax error. ' + e + '\n[Source code:]\n' + resultSource);
    }

    return {
        outputFilePath: absoluteComponentFilePath,
        sourceCode: resultSource
    };
}
