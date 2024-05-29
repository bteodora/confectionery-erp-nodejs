class User {
	constructor(username, password, name, surname, gender, birth_date, role) {
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.birth_date = birth_date;
		this.role = role;
	}

	static checkUser(user) {
		if(!User.checkUsername(user.username))
			return false
		if(!User.checkPassword(user.password))
			return false
		if(!User.checkName(user.name))
			return false
		if(!User.checkSurname(user.surname))
			return false
		if(!User.checkGender(user.gender))
			return false
		if(!User.checkBirthDate(user.birth_date))
			return false
		if(!User.checkRole(user.role))
			return false

		return true
	}

	static checkUsername(username) {
		if(username === '' || username === undefined)
			return false

		return true
	}

	static checkPassword(password) {
		if(password === '' || password === undefined)
			return false

		return true
	}

	static checkName(name) {
		if(name === '' || name === undefined)
			return false

		return true
	}

	static checkSurname(surname) {
		if(surname === '' || surname === undefined)
			return false

		return true
	}

	static checkGender(gender) {
		if((gender !== 'male' && gender !== 'female') || gender === undefined)
			return false

		return true
	}

	static checkBirthDate(birth_date) {
		const regex = /^\d{4}-\d{2}-\d{2}$/;

		if(birth_date === '' || birth_date === undefined)
			return false

		if(!regex.test(birth_date))
			return false

		return true
	}

	static checkRole(role) {
		const validRoles = ['admin', 'manager', 'staff', 'customer'];

		if(role === '' || role === undefined)
			return false

		if(!validRoles.includes(role))
			return false

		return true
	}
};

module.exports = User;