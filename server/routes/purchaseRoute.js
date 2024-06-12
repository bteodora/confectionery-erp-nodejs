const express = require('express');
const router = express.Router();
const purchaseService = require('../services/purchaseService');
const userService = require('../services/userService');
const { verifyToken } = require('../utils/tokenParser');

router.post('/create', verifyToken, (req, res) => {
	const username = req.auth.username;

	if (req.auth.role !== 'customer') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	try {
		let user = userService.getUser(username);
		purchaseService.CreatePurchase(username, user.cart);
		userService.emptyCart(username);

		user = userService.getUser(username);

		return res.status(200).send({
			message: 'Purchase successfully created!',
			points: user.points,
			type: user.type
		});
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

router.get('/byuser', verifyToken, (req, res) => {
	const username = req.auth.username;
	const role = req.auth.role;

	if (role !== 'customer' && role !== 'manager') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	try {
		const purchases = purchaseService.GetByUserId(username);
		return res.status(200).send(purchases);
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

router.post("/cancel/:id", verifyToken, (req, res) => {
	const purchaseId = parseInt(req.params.id);
	const role = req.auth.role;

	if (role !== 'customer') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	try {
		purchaseService.CancelPurchase(purchaseId);
		return res.status(200).send({ message: 'Purchase successfully cancelled!' });
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

router.post("/accept/:id", verifyToken, (req, res) => {
	const purchaseId = parseInt(req.params.id);
	const role = req.auth.role;

	if (role !== 'manager') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	try {
		purchaseService.AcceptPurchase(purchaseId);
		return res.status(200).send({ message: 'Purchase successfully accepted!' });
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

router.post("/decline/:id", verifyToken, (req, res) => {
	const purchaseId = parseInt(req.params.id);
	const role = req.auth.role;

	if (role !== 'manager') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	const declineReason = req.body;

	try {
		purchaseService.DeclinePurchase(purchaseId, declineReason);
		return res.status(200).send({ message: 'Purchase successfully declined!' });
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

module.exports = router;