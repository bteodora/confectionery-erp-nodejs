const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/jsonParser');
const purchaseService = require('./purchaseService');

const usersFilePath = path.join(__dirname, '../data/json/user.json');

exports.getAllUsers = (role) => {
	const users = readJSONFile(usersFilePath);

	if (!role) {
		return users;
	}

	return users.filter(u => u.role === role);
}

exports.getUser = (username) => {
	const users = readJSONFile(usersFilePath);
	const foundUser = users.find(u => u.username === username);

	if (!foundUser) {
		throw new Error('User not found');
	}

	return foundUser;
}

exports.updateUser = (username, user) => {
	const users = readJSONFile(usersFilePath);
	const foundUser = users.find(u => u.username === username);

	if (!foundUser) {
		throw new Error('User not found');
	}

	const index = users.indexOf(foundUser);

	users[index].name = user.name;
	users[index].surname = user.surname
	users[index].gender = user.gender;
	users[index].birth_date = user.birth_date;

	writeJSONFile(usersFilePath, users);
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

	newUser.isBlocked = false;

	users.push(newUser);
	writeJSONFile(usersFilePath, users);
}

exports.login = (username, password) => {
	const users = this.getAllUsers();
	const foundUser = users.find(u => u.username === username && u.password === password);

	if (!foundUser) {
		throw new Error('Invalid username or password');
	}

	if(foundUser.isBlocked){
		throw new Error('Your account has been blocked!');
	}

	if(foundUser.role === 'admin'){
		this.checkSuspiciousUsers();
	}

	return foundUser;
}

exports.getFactoryId = (username) => {
	const foundUser = this.getUser(username);
	return foundUser.factoryId;
}

exports.getRole = (username) => {
	const foundUser = this.getUser(username);
	return foundUser.role;
}

exports.updateCart = (username, newProduct) => {
	const users = this.getAllUsers();
	const foundUser = users.find(u => u.username === username);

	if (!foundUser) {
		throw new Error('User not found');
	}

	const index = users.indexOf(foundUser);

	if (users[index].cart.factoryId === null) {
		users[index].cart.factoryId = newProduct.factoryId;
	}
	else if (users[index].cart.factoryId !== newProduct.factoryId) {
		throw new Error('Cart must contain products from the same factory.\nPlease empty your cart before adding products from another factory');
	}

	chocolate = users[index].cart.products.find(p => p.chocolateId === newProduct.id);
	if (chocolate) {
		chocolate.selectedQuantity = newProduct.selectedQuantity;
	} else {
		users[index].cart.products.push({
			chocolateId: newProduct.id,
			selectedQuantity: newProduct.selectedQuantity
		});
	}

	writeJSONFile(usersFilePath, users);
}

exports.getCart = (username) => {
	const foundUser = this.getUser(username);

	if (!foundUser) {
		throw new Error('User not found');
	}

	return foundUser.cart;
}

exports.deleteFromCart = (username, chocolateId) => {
	const users = this.getAllUsers();
	const foundUser = users.find(u => u.username === username);

	if (!foundUser) {
		throw new Error('User not found');
	}

	const index = users.indexOf(foundUser);

	const chocolateIndex = users[index].cart.products.findIndex(p => p.chocolateId === chocolateId);
	if (chocolateIndex === -1) {
		throw new Error('Product not found in cart');
	}

	users[index].cart.products.splice(chocolateIndex, 1);

	if (users[index].cart.products.length === 0) {
		users[index].cart.factoryId = null;
	}

	writeJSONFile(usersFilePath, users);
}

exports.emptyCart = (username) => {
	const users = this.getAllUsers();
	const foundUser = users.find(u => u.username === username);

	if (!foundUser) {
		throw new Error('User not found');
	}

	const index = users.indexOf(foundUser);

	users[index].cart.factoryId = null;
	users[index].cart.products = [];

	writeJSONFile(usersFilePath, users);
}

exports.addPoints = (username, totalPrice) => {
	const users = this.getAllUsers();
	const foundUser = users.find(u => u.username === username);

	if (!foundUser) {
		throw new Error('User not found');
	}

	const index = users.indexOf(foundUser);

	let factor = 133.0;

	totalPrice < 0 ? factor *= 4.0 : factor *= 1.0;

	users[index].points += totalPrice / 1000.0 * factor;

	this.promoteCustomer(users[index]);

	writeJSONFile(usersFilePath, users);
}

exports.promoteCustomer = (user) => {
	if(user.points < 1000){
		user.type = 'Regular';
	}
	else if(user.points >= 1000 && user.points < 2000){
		user.type = 'Bronze';
	}
	else if(user.points >= 2000 && user.points < 40000){
		user.type = 'Silver';
	}
	else if(user.points >= 40000){
		user.type = 'Gold';
	}
}

exports.checkSuspiciousUsers = () => {
	const users = this.getAllUsers();

	users.forEach(u => {
		if (u.role !== 'customer')
			return;

		let count = purchaseService.CountCancelledPurchasesInLastMonth(u.username);
		count >= 5 ? u.isSuspicious = true : u.isSuspicious = false;
	});

	writeJSONFile(usersFilePath, users);
}

exports.blockUser = (username) => {
	const users = this.getAllUsers();
	const foundUser = users.find(u => u.username === username);

	if (!foundUser) {
		throw new Error('User not found');
	}

	if(foundUser.role === 'admin'){
		throw new Error('Admin account cannot be blocked');
	}

	const index = users.indexOf(foundUser);

	users[index].isBlocked = true;

	writeJSONFile(usersFilePath, users);
}