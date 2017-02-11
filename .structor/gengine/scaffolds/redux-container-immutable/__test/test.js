require('babel-register');
var commons = require('structor-market-gengine-commons');
var componentsFile = require('../merge/componentsFile');
var sagasFile = require('../merge/sagasFile');
var reducerFile = require('../merge/reducerFile');
var componentName = 'TestComponent';
var componentName1 = 'TestComponent1';
var componentGroup = 'TestGroup';


// commons.readFile('./component.js')
//     .then(fileData => {
//         // console.log(fileData);
//         var result = componentsFile.injectComponent(commons.parse(fileData), componentGroup, componentName);
//         result = componentsFile.injectComponent(commons.parse(result), componentGroup, componentName1);
//         console.log(result);
//     })
//     .catch(error => {
//         console.error(error);
//     });

// commons.readFile('./sagas.js')
//     .then(fileData => {
//         // console.log(fileData);
//         let ast = commons.parse(fileData);
//         // console.log(JSON.stringify(ast, null, 4));
//         var result = sagasFile.injectSaga(ast, componentGroup, componentName);
//         result = sagasFile.injectSaga(commons.parse(result), componentGroup, componentName1);
//         console.log(result);
//     })
//     .catch(error => {
//         console.error(error);
//     });

commons.readFile('./reducer.js')
    .then(fileData => {
        // console.log(fileData);
        let ast = commons.parse(fileData);
        // console.log(JSON.stringify(ast, null, 4));
        var result = reducerFile.injectReducer(ast, componentGroup, componentName);
        result = reducerFile.injectReducer(commons.parse(result), componentGroup, componentName1);
        console.log(result);
    })
    .catch(error => {
        console.error(error);
    });