<template>

<CustomerNavbar/>

<div class="chocolates">
	<div class="header">
		<h1>Chocolates in cart</h1>
		<br>
		<h4 v-if="chocolates.length !== 0"><b>Total price in cart: {{ totalPrice }} DIN</b></h4>
		<br>
		<div v-if="chocolates.length !== 0" class="d-grid gap-4 d-md-flex justify-content-md-center">
			<button class="btn btn-success">Submit purchase</button>
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
			totalPrice: 0
		}
	},
	mounted() {
		axiosInstance.get('/user/cart')
		.then((response) => {
			this.factoryId = response.data.factoryId;
			const products = response.data.products;
			products.forEach(p => this.getChocolate(p.chocolateId, p.selectedQuantity));
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
		emptyCart() {
			axiosInstance.delete('/user/cart')
			.then(() => {
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

</style>