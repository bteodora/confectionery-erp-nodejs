const fs = require('fs');

function readJSONFile(filePath) {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(data);
  	} catch (err) {
		console.error(err);
		return null;
  }
}

function writeJSONFile(filePath, data) {
	try {
		const dataString = JSON.stringify(data, null, 2);
		fs.writeFileSync(filePath, dataString, 'utf8');
	}
	catch (err) {
		console.error(err);
	}
}

module.exports = {
	readJSONFile,
	writeJSONFile
};