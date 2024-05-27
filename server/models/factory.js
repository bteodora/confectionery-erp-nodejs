const Location = require('./location');

class Factory {

	static checkFactory(newFactory) {
		if(!Factory.checkName(newFactory.name)
			|| !Factory.checkWorkTime(newFactory.startWorkTime, newFactory.endWorkTime)
			|| !Factory.checkManagerId(newFactory.managerId))

			return false

		if(!newFactory.location)
			return false

		if(!Location.checkLocation(newFactory.location))
			return false

		return true
	}

	static checkName(name) {
		if(name === '' || name === undefined)
			return false

		return true
	}

	static checkWorkTime(startWorkTime, endWorkTime) {
		const regex = /^\d{2}:\d{2}$/;

		if(!regex.test(startWorkTime) || !regex.test(endWorkTime))
			return false

		const start = new Date(`1970-01-01T${startWorkTime}:00`);
		const end = new Date(`1970-01-01T${endWorkTime}:00`);

		if(start >= end)
			return false

		return true
	}

	static checkManagerId(managerId) {
		if(managerId === '' || managerId === undefined)
			return false

		return true
	}
}

module.exports = Factory;