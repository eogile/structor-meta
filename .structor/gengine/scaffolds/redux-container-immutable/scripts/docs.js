'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFile = getFile;

var _lodash = require('lodash');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFile(dataObject, templateText) {
    var metadata = dataObject.metadata,
        project = dataObject.project,
        groupName = dataObject.groupName,
        componentName = dataObject.componentName;


    if (!(0, _lodash.has)(project, 'paths.docsComponentsDirPath')) {
        throw Error('Wrong project configuration. \'docsComponentsDirPath\' field is missing.');
    }

    var absoluteFilePath = _path2.default.join(project.paths.docsComponentsDirPath, componentName + '.md');

    var templateObject = {
        groupName: groupName, componentName: componentName, metadata: metadata
    };

    var resultSource = void 0;
    try {
        resultSource = (0, _lodash.template)(templateText)(templateObject);
    } catch (e) {
        throw Error('lodash template error. ' + e);
    }

    return {
        outputFilePath: absoluteFilePath,
        sourceCode: resultSource,
        isComponent: false
    };
}