<template>
	<div class="card w-75">
		<div class="card-header">
			# ID: {{ purchase.id }}
		</div>
		<ul class="list-group list-group-flush">
			<li class="list-group-item"><b>Date:</b> {{ formatDate(purchase.creationDate) }}</li>
			<li class="list-group-item"><b>Status:</b> {{ purchase.status }}</li>
			<li class="list-group-item"><b>Factory:</b> {{ factoryName }}</li>
		</ul>
		<div class="card-body">
			<h5 class="card-title">Total price: {{ purchase.totalPrice }} DIN</h5>
			<br>
			<a :href="'#products' + purchase.id" class="btn btn-secondary" data-bs-toggle="collapse" role="button" aria-expanded="false"
				aria-controls="collapseExample">
				Products</a>
		</div>
		<div class="collapse" :id="'products' + purchase.id">
			<table class="table">
				<thead>
					<tr>
						<th scope="col-2">#</th>
						<th scope="col-6">Name</th>
						<th scope="col-2">Quantity</th>
						<th scope="col-2">Price</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(product, index) in purchase.products" :key="product.chocolateId">
						<th scope="row" class="col-2">{{ index + 1 }}</th>
						<td class="col-6">{{ product.name }}</td>
						<td class="col-2">{{ product.selectedQuantity }}</td>
						<td class="col-2">{{ product.price }} DIN</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>

import axiosInstance from '@/utils/axiosInstance';

export default {
	name: 'PurchaseCard',
	props: {
		purchase: {
			type: Object,
			required: true
		},
	},
	data() {
		return {
			factoryName: ''
		}
	},
	mounted() {
		this.getFactory();
		this.getCholocates();
	},
	methods: {
		getFactory() {
			axiosInstance.get(`/factory/${this.purchase.factoryId}`)
				.then(response => {
					this.factoryName = response.data.name;
				})
				.catch(error => {
					console.error(error);
				});
		},
		getCholocates() {
			this.purchase.products.forEach(product => {
				axiosInstance.get(`/chocolate/choco/${product.chocolateId}`)
					.then(response => {
						product.name = response.data.name;
					})
					.catch(error => {
						console.error(error);
					});
			});
		},
		formatDate(dateString) {
			let date = new Date(dateString);
			let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
			let timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
			let formattedDate = date.toLocaleDateString(undefined, dateOptions);
			let formattedTime = date.toLocaleTimeString(undefined, timeOptions);
			return `${formattedDate} ${formattedTime}`;
		}
	}
}

</script>

<style scoped>
.card {
	border-radius: 10px;
	box-shadow: 2px 2px 2px lightblue;
	margin: 20px;
}

.table {
	margin-left: 20px;
	width: 95%;
}
</style>