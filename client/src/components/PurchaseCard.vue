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
			<h5 class="card-title">Total price: {{ purchase.totalPrice.toFixed(2) }} DIN</h5>
			<br>
			<div class="d-flex justify-content-between">
				<a :href="'#products' + purchase.id" class="btn btn-secondary" data-bs-toggle="collapse" role="button"
					aria-expanded="false" aria-controls="collapseExample">
					Products</a>

				<div class="ml-auto">
					<div v-if="role == 'manager'">
						<button class="btn btn-success me-3" @click="acceptPurchase" v-if="purchase.status == 'Pending'">Accept</button>
						<button class="btn btn-danger" v-if="purchase.status == 'Pending'" @click="openRejectModal(purchase.id)">Reject</button>
					</div>
					<div v-if="role == 'customer'">
						<button v-if="purchase.status !== 'Cancelled'" class="btn btn-danger" v-on:click="cancelPurchase">Cancel</button>
						<button v-if="purchase.status === 'Accepted'" class="btn btn-primary">Review</button>
					</div>
				</div>
			</div>
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

	<!-- Modal for Reject Purchase -->
	<div class="modal fade" :id="'rejectModal-' + purchase.id" tabindex="-1" aria-labelledby="rejectModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="rejectModalLabel">Reject Purchase</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label for="rejectReason" class="form-label">Reason for rejection</label>
						<textarea id="rejectReason" class="form-control" v-model="rejectReason"></textarea>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-danger" @click="confirmRejectPurchase(purchase.id)">Reject</button>
				</div>
			</div>
		</div>
	</div>

</template>

<script>

import axiosInstance, { getUserProfile } from '@/utils/axiosInstance';

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
			role: '',
			factoryName: '',
			rejectReason: ''
		}
	},
	mounted() {
		this.role = getUserProfile().role;
		this.getFactory();
		this.getChocolates();
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
		getChocolates() {
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
		},
		cancelPurchase() {
			axiosInstance.post(`/purchase/cancel/${this.purchase.id}`)
				.then(response => {
					this.purchase.status = 'Cancelled';
					alert(response.data.message);
				})
				.catch(error => {
					console.error(error);
				});
		},
		declinePurchase(purchaseId, reason) {
			axiosInstance.post(`/purchase/decline/${purchaseId}`, { reason })
				.then(response => {
					this.purchase.status = 'Declined';
					alert(response.data.message);
					// Close the modal
					const rejectModal = new bootstrap.Modal(document.getElementById(`rejectModal-${purchaseId}`));
					rejectModal.hide();
					// Reload the page
					location.reload();
				})
				.catch(error => {
					console.error(error);
				});
		},
		openRejectModal(purchaseId) {
			// Clear previous reason input
			this.rejectReason = '';
			// Open the modal for the specific purchase ID
			const rejectModal = new bootstrap.Modal(document.getElementById(`rejectModal-${purchaseId}`));
			rejectModal.show();
		},
		confirmRejectPurchase(purchaseId) {
			this.declinePurchase(purchaseId, this.rejectReason);
		},
		acceptPurchase() {
			axiosInstance.post(`/purchase/accept/${this.purchase.id}`)
				.then(response => {
					this.purchase.status = 'Accepted';
					alert(response.data.message);
				})
				.catch(error => {
					console.error(error);
				});
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
