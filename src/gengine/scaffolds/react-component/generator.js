import path from 'path';
import {cloneDeep, template} from 'lodash';
import {commons} from 'structor-commons';
import metadata from './metadata.js';
import dependencies from './dependencies.js';

const templateNames = [
	'component', 'defaultModels', 'docs', 'test'
];

const mergeScripts = [
	'componentsFile'
];

export function preProcess(currentDir, dataObject) {

	let newMetaData = cloneDeep(metadata);
	return newMetaData;

}

export function process(currentDir, dataObject) {

	const templateDatas = {};
	let templateReaders = [];

	templateNames.forEach(name => {
		templateReaders.push(
			commons.readFile(path.join(currentDir, 'templates', name + '.tpl'))
				.then(fileData => {
					templateDatas[name] = fileData;
				})
		);
	});
	return Promise.all(templateReaders)
		.then(() => {
			let newDependencies = cloneDeep(dependencies);
			let files = [];
			let file;
			templateNames.forEach(name => {
				const generatorModule = require(path.join(currentDir, 'scripts', name + '.js'));
				file = generatorModule.getFile(dataObject, templateDatas[name]);
				if (file.outputFilePath) {
					file.outputFileName = path.basename(file.outputFilePath);
					files.push(file);
				}
			});
			mergeScripts.forEach(script => {
				const mergeModule = require(path.join(currentDir, 'merge', script + '.js'));
				file = mergeModule.getFile(dataObject, dependencies);
				if (file.outputFilePath) {
					file.outputFileName = path.basename(file.outputFilePath);
					files.push(file);
				}
			});
			return {files, dependencies: newDependencies};
		});
}
