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
}

module.exports = Chocolate;