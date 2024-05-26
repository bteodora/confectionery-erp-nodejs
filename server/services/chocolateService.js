const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/jsonParser');
const chocolateFilePath = path.join(__dirname, '../data/json/chocolate.json');

// Potrebno:
// Sve cokolade za fabriku ✔ 

// MENADZER:
// Kreiranje ✔
// Izmena ✔
// Brisanje ✔
// Dodatno: set image path ✔

// Zastita ce biti implementirana u route-u
// RADNIK:
// Promena kvantiteta ✔

// KUPAC: 
// Promena kvantiteta ✔

exports.GetAllChocolatesForFactory =(factoryId1) => {
    const chocolates = readJSONFile(chocolateFilePath);
    return chocolates.filter(c => c.factoryId == factoryId1);
}

exports.CreateChocolate = (newChocolate) => {
    const chocolates = readJSONFile(chocolateFilePath);
    let chocoId = 1;
    if(chocolates.length > 0) {
		chocoId = chocolates.sort((a, b) => a.id - b.id)[chocolates.length - 1].id + 1;
	}
    newChocolate.status = "OutOfStock";
    newChocolate.quantity = 0;
    newChocolate.id = chocoId;
    chocolates.push(newChocolate);
    writeJSONFile(chocolateFilePath, chocolates);
}

exports.SetImagePath = (chocolateId, imagePath) => {
    const chocolates = readJSONFile(chocolateFilePath);
    const oldChocolate = chocolates.find(c => c.id == chocolateId);

    if(!oldChocolate){
        throw new Error('No such chocolate exists');
    }

    oldChocolate.imagePath = imagePath;
    writeJSONFile(chocolateFilePath, chocolates);
}

exports.UpdateChocolate = (updatedChocolate) => {
    const chocolates = readJSONFile(chocolateFilePath);
    const chocolateIndex = chocolates.findIndex(c => c.id === updatedChocolate.id);

    if (chocolateIndex === -1) {
        throw new Error('No such chocolate exists');
    }
    chocolates[chocolateIndex] = updatedChocolate;
    writeJSONFile(chocolateFilePath, chocolates);
}

exports.DeleteChocolate = (chocoId) =>{
    const chocolates = readJSONFile(chocolateFilePath);
    const chocolateIndex = chocolates.findIndex(c => c.id === chocoId);

    if (chocolateIndex === -1) {
        throw new Error('No such chocolate exists');
    }

    chocolates.splice(chocolateIndex, 1);
    writeJSONFile(chocolateFilePath, chocolates);
}

exports.SetQuantity = (chocoId, newQuantity) =>
{
    const chocolates = readJSONFile(chocolateFilePath);
    const foundChocolate = chocolates.find(c => c.id == chocoId);

    if(!foundChocolate){
        throw new Error('No such chocolate exists');
    }

    foundChocolate.quantity = newQuantity;
    writeJSONFile(chocolateFilePath, chocolates);
}
