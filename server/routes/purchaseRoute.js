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
		const user = userService.getUser(username);
		purchaseService.CreatePurchase(username, user.cart);
		userService.emptyCart(username);
		return res.status(200).send({ message: 'Purchase successfully created!' });
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

module.exports = router;