<template>
	<CustomerNavbar/>
  
	<div class="chocolates">
	  <div class="header">
		<h1>Chocolates in cart</h1>
		<br>
		<div class="user-info-container">
		  <div :class="{'user-info': true, 'move-left': showCustomerTypes, 'move-right': !showCustomerTypes}" class="w-25" ref="userInfo">
			<div class="info-row">
			  <span>Points:</span>
			  <span>{{ user.points.toFixed(2) }}</span>
			</div>
			<div class="info-row">
			  <span>Customer type:</span>
			  <span>{{ user.type }}</span>
			</div>
			<div class="info-row">
			  <span>Discount:</span>
			  <span>{{ user.discount }}</span>
			</div>
			<button class="btn btn-secondary" @click="toggleCustomerTypes">Show Customer Types</button>
		  </div>
		  <transition name="fade">
			<div v-if="showCustomerTypes" class="customer-types w-25" ref="customerTypes">
			  <div class="info-row">
				<span>Regular customer:</span>
				<span>0-1000 points</span>
			  </div>
			  <div class="info-row">
				<span>Bronze customer:</span>
				<span>1000-2000 points</span>
			  </div>
			  <div class="info-row">
				<span>Silver customer:</span>
				<span>2000-40000 points</span>
			  </div>
			  <div class="info-row">
				<span>Golden customer:</span>
				<span>40000+ points</span>
			  </div>
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
		if (this.showCustomerTypes) {
		  this.showCustomerTypes = false;
		} else {
		  this.showCustomerTypes = true;
		  this.$nextTick(() => {
			const userInfoRect = this.$refs.userInfo.getBoundingClientRect();
			const customerTypesWidth = this.$refs.customerTypes.offsetWidth;
			const offset = (userInfoRect.width + customerTypesWidth) / 4;
			this.$refs.customerTypes.style.left = `${userInfoRect.right - offset}px`;
		  });
		}
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
	position: relative;
  }
  
  .user-info, .customer-types {
	display: inline-block;
	padding: 20px;
	border: 1px solid black;
	border-radius: 10px;
	background-color: #f0f0f0;
	margin-bottom: 30px;
	position: relative;
	width: 250px;
  }
  
  .user-info {
	z-index: 2;
	transition: transform 0.5s ease;
  }
  
  .customer-types {
	position: absolute;
	top: 0;
	z-index: 1;
	transition: transform 0.5s ease;
  }
  
  .info-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	font-size: 1.1em;
  }
  
  .move-left {
	transform: translateX(-50%);
  }
  
  .move-right {
	transform: translateX(0);
  }
  
  .fade-enter-active, .fade-leave-active {
	transition: opacity 0.5s ease;
  }
  
  .fade-enter, .fade-leave-to {
	opacity: 0;
  }
  </style>
  
  