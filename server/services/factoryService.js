const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/jsonParser');
const factoriesFilePath = path.join(__dirname, '../data/factory.json');
const userService = require('./userService');

exports.getAllFactories = () => {
	const factories = readJSONFile(factoriesFilePath);
	return factories;
}

exports.registerFactory = (newFactory) => {
	const factories = readJSONFile(factoriesFilePath);

	if(factories.length === 0) {
		newFactory.id = 1;
	}
	else {
		newFactory.id = factories.sort((a, b) => a.id - b.id)[factories.length - 1].id;
	}

	userService.setManagersFactoryId(newFactory.managerId, newFactory.id);

	factories.push(newFactory);
	writeJSONFile(factoriesFilePath, factories);
}