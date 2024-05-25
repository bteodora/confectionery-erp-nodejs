const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/jsonParser');

const usersFilePath = path.join(__dirname, '../data/json/user.json');

exports.getAllUsers = (role) => {
	const users = readJSONFile(usersFilePath);

	if (!role) {
		return users;
	}

	return users.filter(u => u.role === role);
}

exports.getAvailableManagers = () => {
	const users = readJSONFile(usersFilePath);
	return users.filter(u => u.role === 'manager' && u.factoryId === null);
}

exports.setManagersFactoryId = (managerId, factoryId) => {
	const users = readJSONFile(usersFilePath);
	const foundUser = users.find(u => u.username === managerId);

	if (!foundUser) {
		throw new Error('User not found');
	}

	foundUser.factoryId = factoryId;
	writeJSONFile(usersFilePath, users);
}

exports.registerUser = (newUser) => {
	const users = readJSONFile(usersFilePath);
	const foundUser = users.find(u => u.username === newUser.username)

	if (foundUser) {
		throw new Error('Username already exists');
	}

	users.push(newUser);
	writeJSONFile(usersFilePath, users);
}

exports.login = (username, password) => {
	const users = readJSONFile(usersFilePath);
	const foundUser = users.find(u => u.username === username && u.password === password);

	if (!foundUser) {
		throw new Error('Invalid username or password');
	}
}

exports.getRole = (username) => {
	const users = readJSONFile(usersFilePath);
	const foundUser = users.find(u => u.username === username);
	return foundUser.role;
}
