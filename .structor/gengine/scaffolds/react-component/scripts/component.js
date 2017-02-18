'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFile = getFile;

var _lodash = require('lodash');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _structorCommons = require('structor-commons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFile(dataObject, templateText) {
    var index = dataObject.index,
        model = dataObject.model,
        metadata = dataObject.metadata,
        project = dataObject.project,
        groupName = dataObject.groupName,
        componentName = dataObject.componentName;


    if (!(0, _lodash.has)(project, 'paths.appDirPath')) {
        throw Error('Wrong project configuration. \'appDirPath\' field is missing.');
    }

    var modelComponentMap = (0, _structorCommons.getModelComponentMap)(model);

    var imports = [];
    var absoluteComponentDirPath = _path2.default.join(project.paths.appDirPath, 'components', groupName, componentName);
    var absoluteComponentFilePath = _path2.default.join(absoluteComponentDirPath, 'index.js');

    var importItem = void 0;

    if (index.groups) {
        (0, _lodash.forOwn)(index.groups, function (value, prop) {
            if (value.components && value.components.length > 0) {
                value.components.forEach(function (componentInIndex) {
                    if (componentInIndex.name !== componentName && modelComponentMap[componentInIndex.name]) {
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

    var templateObject = {
        model: model, imports: imports, groupName: groupName, componentName: componentName, metadata: metadata
    };

    var resultSource = void 0;
    try {
        resultSource = (0, _lodash.template)(templateText)(templateObject);
    } catch (e) {
        throw Error('lodash template error. ' + e);
    }

    try {
        resultSource = (0, _structorCommons.formatJs)(resultSource);
        resultSource = resultSource.replace(/(^\s*[\r\n]){2,}/gm, "\n");
    } catch (e) {
        throw Error('JavaScript syntax error. ' + e + '\n[Source code:]\n' + resultSource);
    }

    return {
        outputFilePath: absoluteComponentFilePath,
        sourceCode: resultSource
    };
}