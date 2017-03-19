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
        project = dataObject.project,
        namespace = dataObject.namespace;


    if (!(0, _lodash.has)(project, 'paths.dir')) {
        throw Error('Wrong project configuration. \'dir\' field is missing.');
    }

    var srcModel = _structorCommons.gengine.combineAllModuleComponents(index, namespace);
    var modelComponentList = _structorCommons.gengine.getModelComponentList(index, srcModel);
    if (modelComponentList && modelComponentList.length > 0) {
        var filtered = modelComponentList.filter(function (item) {
            return !item.namespace || item.namespace !== namespace;
        });
        console.log(JSON.stringify(filtered, null, 4));
        if (filtered && filtered.length > 0) {
            throw Error('Namespace models are including components from different namespaces.');
        }
    }

    var _gengine$prepareModel = _structorCommons.gengine.prepareModelWithImports(index, srcModel, namespace),
        imports = _gengine$prepareModel.imports,
        model = _gengine$prepareModel.model;

    var absoluteComponentFilePath = _path2.default.join(project.paths.dir, '__sandbox', 'App.js');

    var templateObject = {
        model: model, imports: imports, componentName: 'App'
    };

    var resultSource = void 0;
    try {
        resultSource = (0, _lodash.template)(templateText)(templateObject);
    } catch (e) {
        throw Error('lodash template error. ' + e);
    }

    try {
        resultSource = _structorCommons.commons.formatJs(resultSource);
        resultSource = resultSource.replace(/(^\s*[\r\n]){2,}/gm, "\n");
    } catch (e) {
        throw Error('JavaScript syntax error. ' + e + '\n[Source code:]\n' + resultSource);
    }

    return {
        outputFilePath: absoluteComponentFilePath,
        sourceCode: resultSource
    };
}