const express = require('express');
const router = express.Router();
const purchaseService = require('../services/purchaseService');
const userService = require('../services/userService');
const factoryService = require('../services/factoryService');
const { verifyToken, checkRole } = require('../utils/tokenParser');

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

router.get('/byfactory', verifyToken, (req, res) => {
	const username = req.auth.username;
	const role = req.auth.role;

	if (role !== 'manager') { 
		return res.status(403).send({ message: 'Forbidden' });
	}

	try {
		const purchases = purchaseService.getByUsersFactoryId(username);
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

router.post("/comment/:id", verifyToken, (req, res) => {
    const purchaseId = parseInt(req.params.id);
    const role = req.auth.role;
    const comment = req.body.comment;

    if (role !== 'customer') {
        return res.status(403).send({ message: 'Forbidden' });
    }

    try {
        comment.factoryRating = parseInt(comment.factoryRating);

        if (!comment)
            throw new Error('Comment cannot be empty');

        if(comment.factoryRating < 1 || comment.factoryRating > 5)
            throw new Error('Factory rating must be between 1 and 5');

        if(comment.text.length > 256 || comment.text.length < 1)
            throw new Error('Comment text size invalid');

        purchaseService.CommentPurchase(purchaseId, comment);
        const purchase = purchaseService.GetById(purchaseId);
        factoryService.updateRating(purchase.factoryId);
        return res.status(200).send({ message: 'Comment successfully added!' });
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

router.get("/comments/byfactory/:id", checkRole, (req, res) => {
	const factoryId = parseInt(req.params.id);
	const role = req.auth.role;

	try {
		const comments = purchaseService.GetComments(factoryId);

		if (role === 'guest' || role === 'customer')
			comments = comments.filter(c => c.comment.status === 'Approved');

		return res.status(200).send(comments);
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

router.post("/commentapprove", checkRole, (req, res) =>{
	const role = req.auth.role;

	if (role !== 'manager') {
		return res.status(403).send({ message: 'Forbidden ovde' });
	}

	const comment = req.body;

	try {
		purchaseService.ApproveComment(comment);
		return res.status(200).send({ message: 'Comment successfully approved!' });
	}
	catch (error) {
		return res.status(400).send(error.message);
	}

});

router.post("/commentreject", checkRole, (req, res) => {
	const role = req.auth.role;

	if (role !== 'manager') {
		return res.status(403).send({ message: 'Forbidden reject' });
	}

	const comment = req.body;

	try {
		purchaseService.RejectComment(comment);
		return res.status(200).send({ message: 'Comment successfully rejected!' });
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

router.get("/commentfactoryid", verifyToken, (req, res) => {
	const comment = req.body;
	try {
		const factoryId = purchaseService.GetFactoryIdByComment(comment);
		return res.status(200).send(factoryId);
	}
	catch (error) {
		return res.status(400).send(error.message);
	}
});

module.exports = router;