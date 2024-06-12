<template>

<CustomerNavbar/>

<div class="chocolates">
	<div class="header">
		<h1>Chocolates in cart</h1>
		<br>
		<div class="user-info w-25">
			<h5><span>Points:</span> {{ user.points }}</h5>
			<h5><span> Customer type:</span> {{ user.type }}</h5>
			<h5><span>Discount:</span> {{ user.discount }}</h5>
		</div>
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
			user: {}
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
		setDiscount(type) {
			type = this.user.type;
			if(type === 'regular') {
				this.user.discount = 'no discount';
				this.discountPrice = this.totalPrice;
			}
			else if(type === 'bronze') {
				this.user.discount = '5%';
				this.discountPrice = this.totalPrice * 0.95;
			}
			else if(type === 'silver') {
				this.user.discount = '10%';
				this.discountPrice = this.totalPrice * 0.90;
			}
			else if(type === 'gold') {
				this.user.discount = '15%';
				this.discountPrice = this.totalPrice * 0.85;
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
				this.emptyCart();
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

.user-info {
	display: inline-block;
	padding: 20px;
	border: 1px solid black;
	border-radius: 10px;
	background-color: #f0f0f0;
	margin-bottom: 30px;
}

.user-info h5 {
	display: flex; /* Makes the h5 a flex container */
    justify-content: space-between;
}

</style>