<template>
	<CustomerNavbar/>
  
	<div class="chocolates">
	  <div class="header">
		<h1>Chocolates in cart</h1>
		<br>
		<div class="user-info-container">
		  <div :class="{'user-info': true, 'slide-left': showCustomerTypes, 'slide-right': !showCustomerTypes}" class="w-25">
			<h5><span>Points:</span> {{ user.points.toFixed(2) }}</h5>
			<h5><span> Customer type:</span> {{ user.type }}</h5>
			<h5><span>Discount:</span> {{ user.discount }}</h5>
			<button class="btn btn-secondary" @click="toggleCustomerTypes">Show Customer Types</button>
		  </div>
		  <transition name="fade">
			<div v-if="showCustomerTypes" class="customer-types w-25">
			  <h5>Regular customer: <span>0-1000 points</span></h5>
			  <h5>Bronze customer: <span>1000-2000 points</span></h5>
			  <h5>Silver customer: <span>2000-40000 points</span></h5>
			  <h5>Golden customer: <span>40000+ points</span></h5>
			</div>
		  </transition>
		</div>
		<br>
		<div v-if="chocolates.length !== 0">
		  <h4>Total cart price: {{ totalPrice }} DIN</h4>
		  <h4><b>Price after discount: {{ discountPrice }} DIN</b></h4>
		</div>
		<br>
		<div v-if="chocolates.length !== 0" class="d-grid gap-4 d-md-flex justify-content-md-center">
		  <button class="btn btn-success" v-on:click="createPurchase">Submit purchase</button>
		  <button class="btn btn-danger" v-on:click="emptyCart">Empty cart</button>
		</div>
	  </div>
	  <div class="container d-flex flex-wrap justify-content-center">
		<ChocolateCard v-for="chocolate in chocolates" :key="chocolate.id" :chocolate="chocolate" :inCart="true"/>
		<p v-if="chocolates.length === 0" class="empty-cart-message"><i>Cart is empty...</i></p>
	  </div>
	</div>
</template>
  
  

  <script>
  import ChocolateCard from '@/components/ChocolateCard.vue';
  import CustomerNavbar from '@/components/Customer/CustomerNavbar.vue';
  import axiosInstance from '@/utils/axiosInstance';
  
  export default {
	name: 'CustomerCartView',
	components: {
	  ChocolateCard,
	  CustomerNavbar
	},
	data() {
	  return {
		factoryId: null,
		chocolates: [],
		totalPrice: 0,
		discountPrice: 0,
		user: { points: 0.0 },
		showCustomerTypes: false
	  }
	},
	mounted() {
	  axiosInstance.get('/user/cart')
		.then((response) => {
		  this.factoryId = response.data.factoryId;
		  const products = response.data.products;
		  products.forEach(p => this.getChocolate(p.chocolateId, p.selectedQuantity));
  
		  this.getUser();
		})
		.catch((error) => {
		  console.log(error);
		});
	},
	methods: {
	  getChocolate(chocolateId, selectedQuantity) {
		axiosInstance.get(`/chocolate/choco/${chocolateId}`)
		  .then((response) => {
			let chocolate = response.data;
			chocolate.selectedQuantity = selectedQuantity;
			this.chocolates.push(chocolate);
			this.totalPrice += chocolate.price * selectedQuantity;
		  })
		  .catch((error) => {
			console.log(error);
		  });
	  },
	  getUser() {
		axiosInstance.get('/user/profile')
		  .then((response) => {
			this.user = response.data;
			this.setDiscount();
		  })
		  .catch((error) => {
			console.log(error);
		  });
	  },
	  setDiscount() {
		const type = this.user.type;
		if (type === 'Regular') {
		  this.user.discount = 'no discount';
		  this.discountPrice = this.totalPrice;
		} else if (type === 'Bronze') {
		  this.user.discount = '5%';
		  this.discountPrice = this.totalPrice * 0.95;
		} else if (type === 'Silver') {
		  this.user.discount = '10%';
		  this.discountPrice = this.totalPrice * 0.90;
		} else if (type === 'Gold') {
		  this.user.discount = '15%';
		  this.discountPrice = this.totalPrice * 0.85;
		}
	  },
	  toggleCustomerTypes() {
		this.showCustomerTypes = !this.showCustomerTypes;
	  },
	  emptyCart() {
		axiosInstance.delete('/user/cart')
		  .then(() => {
			this.chocolates = [];
			this.totalPrice = 0;
		  })
		  .catch((error) => {
			console.log(error);
		  });
	  },
	  createPurchase() {
		axiosInstance.post('/purchase/create')
		  .then((res) => {
			alert(res.data.message);
  
			this.user.points = res.data.points;
			this.user.type = res.data.type;
			this.setDiscount();
  
			this.chocolates = [];
			this.totalPrice = 0;
		  })
		  .catch((error) => {
			console.log(error);
		  });
	  }
	}
  }
  </script>
  

<style scoped>

  .header {
	text-align: center;
	padding-bottom: 2%;
	border-bottom: 1px solid lightgray;
  }
  
  .chocolates {
	padding-top: 2%;
	padding-bottom: 2%;
	justify-content: center;
  }
  
  .empty-cart-message {
	font-size: 20px;
	padding-top: 5%;
  }
  
  .user-info-container {
	display: flex;
	justify-content: center;
	gap: 20px;
  }
  
  .user-info, .customer-types {
	display: inline-block;
	padding: 20px;
	border: 1px solid black;
	border-radius: 10px;
	background-color: #f0f0f0;
	margin-bottom: 30px;
  }
  
  .user-info h5, .customer-types h5 {
	display: flex;
	justify-content: space-between;
  }
  
  .fade-enter-active, .fade-leave-active {
	transition: all 0.5s ease;
  }
  
  .fade-enter, .fade-leave-to {
	opacity: 0;
	transform: translateX(20px);
  }
  
  .btn-info {
	width: 200px; /* Make the button wider */
	height: 30px; /* Make the button shorter */
	margin-top: 10px;
  }
  
  @keyframes slideLeft {
	from {
	  transform: translateX(0);
	}
	to {
	  transform: translateX(-20px);
	}
  }
  
  @keyframes slideRight {
	from {
	  transform: translateX(-20px);
	}
	to {
	  transform: translateX(0);
	}
  }
  
  .slide-left {
	animation: slideLeft 0.5s forwards;
  }
  
  .slide-right {
	animation: slideRight 0.5s forwards;
  }
  
</style>
  