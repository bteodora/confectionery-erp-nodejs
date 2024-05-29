const express = require('express');
const router = express.Router();
const chocolateService = require('../services/chocolateService');
const {verifyToken} = require('../utils/tokenParser');
const upload = require('../utils/imgParser');
const path = require('path');

// Potrebno:
// Sve cokolade za fabriku ✔

// MENADZER:
// Kreiranje ✔
// Izmena ✔
// Brisanje ✔
// ! set Image ✔

// RADNIK i KUPAC:
// Promena kvantiteta ✔

router.get('/:factoryId', (req, res) => {
    const factoryId = Number(req.params.factoryId);    
    const chocolates = chocolateService.GetAllChocolatesForFactory(factoryId);
  
    if (chocolates.length > 0) {      
      return res.status(200).send(chocolates);
    } else {
      console.error(`No chocolates found for factory ID: ${factoryId}`);
      return res.status(404).send({ error: 'No chocolates found for this factory' });
    }
  });

  router.get('/img/:chocolateId', (req, res) => {
	const chocolateId = Number(req.params.chocolateId);
	const imgPath = chocolateService.getImagePath(chocolateId);
	const fullImgPath = path.join(process.cwd().replace('\\', '/'), imgPath);
	return res.status(200).sendFile(fullImgPath);
});

router.post('/changeQuantity/:newQuantity', verifyToken, (req, res) => {
    if(req.auth.role !== 'worker' || req.auth.role !== 'customer') { //customer smanjuje worker povecava
		return res.status(403).send({ message: 'Forbidden' });
	}
    const newQuantity = Number(req.params.newQuantity);
    try{
        chocolateService.SetQuantity(newQuantity);
        res.status(200).send({ message: 'Successfully created new chocolate'});
    }
    catch{
        res.status(400).send({ message: err.message});
    }
});

router.post('/img/upload/:chocoId', verifyToken, upload.single('img'), (req, res, next) => {
    if (req.auth.role !== 'manager') {
        return res.status(403).send({ message: 'Forbidden' });
    }

    const chocoId = Number(req.params.chocoId);
    if (isNaN(chocoId)) {
        return res.status(400).send({ message: 'Invalid chocolate ID' });
    }

    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    const imgPath = req.file.path;
    //console.log(`Uploading image for chocolate ID: ${chocoId}, image path: ${imgPath}`);

    try {
        chocolateService.SetImagePath(chocoId, imgPath);
        res.status(200).send({ message: 'Successfully uploaded a picture of the chocolate' });
    } catch (err) {
        console.error('Error setting image path:', err);
        res.status(400).send({ message: err.message });
    }
});

router.post('/createchocolate', verifyToken, (req, res) => {
    if(req.auth.role !== 'manager') {
		return res.status(403).send({ message: 'Forbidden' });
	}

    const newChocolate = req.body;
    try{
        let chocoId = chocolateService.CreateChocolate(newChocolate);
        res.status(200).send({ message: 'Successfully created new chocolate', chocoId: chocoId});
    }
    catch{
        res.status(400).send({ message: err.message});
    }
});

router.post('/updatechocolate', verifyToken, (req, res) => {
    if(req.auth.role !== 'manager') {
		return res.status(403).send({ message: 'Forbidden' });
	}

    const newChocolate = req.body;
    try{
        chocolateService.UpdateChocolate(newChocolate);
        res.status(200).send({ message: 'Successfully updated chocolate'});
    }
    catch{
        res.status(400).send({ message: err.message});
    }
});

router.post('/deletechocolate/:chocolateId', verifyToken, (req, res) => {
    console.log('usao u funkciju');
    if (req.auth.role !== 'manager') {
        return res.status(403).send({ message: 'Forbidden' });
    }

    const chocolateId = Number(req.params.chocolateId);
    try {
        console.log('usao u delete');
        chocolateService.DeleteChocolate(chocolateId);
        res.status(200).send({ message: 'Successfully deleted chocolate' });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;