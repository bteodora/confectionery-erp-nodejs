const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/jsonParser');

const usersFilePath = path.join(__dirname, '../data/user.json');

exports.getAllUsers = () => {
	return readJSONFile(usersFilePath);
}

exports.registerCustomer = (newUser) => {
	const users = readJSONFile(usersFilePath);

	const foundUser = users.find(u => u.username === newUser.username)

	if (foundUser) {
		throw new Error('Username already exists');
	}

	newUser.role = 'customer';
	newUser.points = 0;
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
