class User {
	constructor({username, password, name, surname, gender, birth_date, role}) {
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.birth_date = birth_date;
		this.role = role;
	}
};

module.exports = User;