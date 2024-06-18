const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/jsonParser');
const purchaseFilePath = path.join(__dirname, '../data/json/purchase.json');
const chocolateService = require('./chocolateService');
const userService = require('./userService');

exports.GetByUserId = (username) => {
	const purchases = readJSONFile(purchaseFilePath);
	const userPurchases = purchases.filter(p => p.username == username);
	const nonDeleted = userPurchases.filter(p => p.status !== 'Deleted');
	return nonDeleted;
}

exports.GetByFactoryId = (factoryId) => {
	const purchases = readJSONFile(purchaseFilePath);
	const factoryPurchases = purchases.filter(p => p.factoryId == factoryId);
	const nonDeleted = factoryPurchases.filter(p => p.status !== 'Deleted');
	return nonDeleted;
}

exports.getByUsersFactoryId = (username) => {
	const purchases = readJSONFile(purchaseFilePath);
	const factoryId = userService.getFactoryId(username);
	const factoryPurchases = purchases.filter(p => p.factoryId == factoryId);
	const nonDeleted = factoryPurchases.filter(p => p.status !== 'Deleted');
	return nonDeleted;
}

exports.GetById = (purchaseId) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.id == purchaseId);
	return purchase;
}

exports.CreatePurchase = (username, cart) => {
	const purchases = readJSONFile(purchaseFilePath);

	let purchaseId = Date.now().toString(36).slice(0, 10);
	let randomChars = Math.random().toString(36).substring(2);
	purchaseId += randomChars;
	purchaseId = purchaseId.slice(0, 10);

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

	userService.addPoints(username, newPurchase.totalPrice);
	cart.products.forEach(p => chocolateService.AddQuantity(p.chocolateId, -p.selectedQuantity));

	purchases.push(newPurchase);
	writeJSONFile(purchaseFilePath, purchases);
}

exports.CancelPurchase = (purchaseId) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.id == purchaseId);

	if(!purchase){
		throw new Error('No such purchase exists');
	}

	if(purchase.status != 'Pending'){
		throw new Error('Purchase cannot be canceled');
	}

	purchase.status = 'Cancelled';
	purchase.products.forEach(p => chocolateService.AddQuantity(p.chocolateId, p.selectedQuantity));
	userService.addPoints(purchase.username, -purchase.totalPrice);
	writeJSONFile(purchaseFilePath, purchases);
}

exports.DeclinePurchase = (purchaseId, declineReason) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.id == purchaseId);

	if(!purchase){
		throw new Error('No such purchase exists');
	}

	purchase.status = 'Declined';
	purchase.declineReason = declineReason;
	purchase.products.forEach(p => chocolateService.AddQuantity(p.chocolateId, p.selectedQuantity));
	writeJSONFile(purchaseFilePath, purchases);
}

exports.AcceptPurchase = (purchaseId) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.id == purchaseId);

	if(!purchase){
		throw new Error('No such purchase exists');
	}

	purchase.status = 'Accepted';
	writeJSONFile(purchaseFilePath, purchases);
}

exports.CommentPurchase = (purchaseId, comment) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.id == purchaseId);

	if(!purchase){
		throw new Error('No such purchase exists');
	}

	if(purchase.status != 'Accepted' || purchase.comment != null){
		throw new Error('Purchase cannot be commented');
	}
	comment.factoryId = purchase.factoryId;
	comment.status = 'Pending';
	comment.creationDate = new Date();
	purchase.comment = comment;
	writeJSONFile(purchaseFilePath, purchases);
}

exports.GetComments = (factoryId) => {
	const purchases = readJSONFile(purchaseFilePath);
	const factoryPurchases = purchases.filter(p => p.factoryId == factoryId && p.comment != null);

	const comments = factoryPurchases.map(p => {
		return {
			id: p.id,
			username: p.username,
			...p.comment
		}
	});
	const nonDeleted = comments.filter(c => c.status !== 'Deleted');
	return nonDeleted;
}

exports.CountCancelledPurchasesInLastMonth = (username) => {
	const purchases = readJSONFile(purchaseFilePath);
	const userPurchases = purchases.filter(p => p.username == username && p.status == 'Cancelled');
	const lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);

	const cancelledPurchases = userPurchases.filter(p => new Date(p.creationDate) >= lastMonth);
	return cancelledPurchases.length;
}

exports.ApproveComment = (comment) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.comment && p.comment.factoryRating === comment.factoryRating && p.comment.text === comment.text && p.comment.creationDate === comment.creationDate);

	if (!purchase) {
		throw new Error('No such purchase or comment exists');
	}

	purchase.comment.status = 'Approved';
	writeJSONFile(purchaseFilePath, purchases);
}

exports.DeletePurchase = (purchaseId) =>{
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.id == purchaseId);

	if(!purchase){
		throw new Error('No such purchase exists');
	}

	purchase.status = 'Deleted';
	if(purchase.comment != null){
		purchase.comment.status = 'Deleted';
	}
	writeJSONFile(purchaseFilePath, purchases);
}

exports.DeleteComment = (purchaseId) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.id == purchaseId);

	if (!purchase) {
		throw new Error('No such purchase exists');
	}

	purchase.comment.status = 'Deleted';
	writeJSONFile(purchaseFilePath, purchases);
}

exports.RejectComment = (comment) => {
	const purchases = readJSONFile(purchaseFilePath);
	const purchase = purchases.find(p => p.comment && p.comment.factoryRating === comment.factoryRating && p.comment.text === comment.text && p.comment.creationDate === comment.creationDate);

	if (!purchase) {
		throw new Error('No such purchase or comment exists');
	}

	purchase.comment.status = 'Rejected';
	writeJSONFile(purchaseFilePath, purchases);
}
