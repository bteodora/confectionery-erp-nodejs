const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/jsonParser');
const purchaseFilePath = path.join(__dirname, '../data/json/purchase.json');
const chocolateService = require('./chocolateService');
const userService = require('./userService');

exports.GetByUserId = (username) => {
	const purchases = readJSONFile(purchaseFilePath);
	const userPurchases = purchases.filter(p => p.username == username);
	return userPurchases;
}

exports.GetByFactoryId = (factoryId) => {
	const purchases = readJSONFile(purchaseFilePath);
	const factoryPurchases = purchases.filter(p => p.factoryId == factoryId);
	return factoryPurchases;
}

exports.ChangePurchaseStatus = (purchaseId, status) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.id == purchaseId);

	if(!purchase){
		throw new Error('No such purchase exists');
	}

	purchase.status = status;
	writeJSONFile(purchaseFilePath, purchases);
}

exports.CreatePurchase = (username, cart) => {
	const purchases = readJSONFile(purchaseFilePath);

	let purchaseId = 1;

	if(purchases.length > 0) {
		purchaseId = purchases.sort((a, b) => a.id - b.id)[purchases.length - 1].id + 1;
	}

	cart.products.forEach(p => p.price = chocolateService.GetById(p.chocolateId).price);

	const newPurchase = {
		id: purchaseId,
		creationDate: new Date(),
		username: username,
		factoryId: cart.factoryId,
		totalPrice: cart.products.reduce((acc, curr) => acc + curr.price * curr.selectedQuantity, 0),
		products: cart.products,
		status: 'Pending',
		declineReason: null,
		comment: null
	}

	purchases.push(newPurchase);
	userService.updatePoints(username, newPurchase.totalPrice);
	writeJSONFile(purchaseFilePath, purchases);
}