class Chocolate {
	constructor(id, name, price, type, factoryId, category, weight, description, imagePath, status, quantity) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.type = type;
		this.factoryId = factoryId;
		this.category = category;
		this.weight = weight;
		this.description = description;
		this.imagePath = imagePath;
		this.status = status; // (In Stock, Out of Stock)
		this.quantity = quantity;
	}

	static checkChocolate(chocolate) {
		if(!Chocolate.checkName(chocolate.name))
			return false;
		if(!Chocolate.checkPrice(chocolate.price))
			return false;
		if(!Chocolate.checkType(chocolate.type))
			return false;
		if(!Chocolate.checkFactoryId(chocolate.factoryId))
			return false;
		if(!Chocolate.checkCategory(chocolate.category))
			return false;
		if(!Chocolate.checkWeight(chocolate.weight))
			return false;
		if(!Chocolate.checkDescription(chocolate.description))
			return false;

		return true;
	}

	static checkName(name) {
		return name !== '' && name !== undefined;
	}

	static checkPrice(price) {
		return !isNaN(price) && price > 0;
	}

	static checkType(type) {
		return type !== '' && type !== undefined;
	}

	static checkFactoryId(factoryId) {
		return factoryId !== '' && factoryId !== undefined;
	}

	static checkCategory(category) {
		return category !== '' && category !== undefined;
	}

	static checkWeight(weight) {
		return !isNaN(weight) && weight > 0;
	}

	static checkDescription(description) {
		return description !== '' && description !== undefined;
	}
}

module.exports = Chocolate;