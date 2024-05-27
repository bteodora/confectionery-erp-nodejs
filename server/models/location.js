class Location {

	static checkLocation(loc) {
		if(!loc || loc === undefined)
			return false;

		if(!Location.checkName(loc.name))
			return false;

		if(!Location.checkLonLat(loc.lon, loc.lat))
			return false;

		if(!Location.checkAddress(loc.address))
			return false;

		if(!Location.checkCity(loc.city))
			return false;

		if(!Location.checkZip(loc.zip))
			return false;

		return true;
	}

	static checkLonLat(lon, lat) {
		if(typeof lon !== 'number' || typeof lat !== 'number')
			return false;

		return true;
	}

	static checkAddress(address) {
		if(address === '' || address === undefined)
			return false;

		return true;
	}

	static checkCity(city) {
		if(city === '' || city === undefined)
			return false;

		return true;
	}

	static checkZip(zip) {
		if(zip === '' || zip === undefined)
			return false;

		return true;
	}
}

module.exports = Location;