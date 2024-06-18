<template>
	<div class="card w-75">
	  <div class="card-header d-flex justify-content-between align-items-center">
		<div># ID: {{ purchase.id }}</div>
		<div v-if="role !== 'customer'">Customer name: {{ fullname }}</div>
	  </div>
	  <ul class="list-group list-group-flush">
		<li class="list-group-item"><b>Date:</b> {{ formatDate(purchase.creationDate) }}</li>
		<li class="list-group-item"><b>Status:</b> {{ purchase.status }}</li>
		<li class="list-group-item" v-if="purchase.status === 'Declined'"><b>Reason for Decline:</b> {{ purchase.declineReason.reason }}</li>
		<li class="list-group-item"><b>Factory:</b> {{ purchase.factoryName }}</li>
	  </ul>
	  <div class="card-body">
		<h5 class="card-title">Total price: {{ purchase.totalPrice.toFixed(2) }} DIN</h5>
		<br>
		<div class="d-flex justify-content-between">
		  <a :href="'#products' + purchase.id" class="btn btn-secondary" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseExample">
			Products
		  </a>
		  <div class="ml-auto">
			<button v-if="role === 'admin'" class="btn btn-danger" @click="delete">Delete</button>
			<div v-if="role == 'manager'">
			  <button class="btn btn-success me-3" @click="acceptPurchase" v-if="purchase.status == 'Pending'">Accept</button>
			  <button class="btn btn-danger" v-if="purchase.status == 'Pending'" @click="openRejectModal(purchase.id)">Reject</button>
			</div>
			<div v-if="role == 'customer'">
			  <button v-if="purchase.status === 'Pending'" class="btn btn-danger" v-on:click="cancelPurchase">Cancel</button>
			  <button v-if="purchase.status === 'Accepted' && purchase.comment === null" type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#reviewModal' + purchase.id">Review</button>
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

	  <div class="modal fade" :id="'reviewModal' + purchase.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
		<div class="modal-dialog">
		  <div class="modal-content">
			<div class="modal-header">
			  <h5 class="modal-title" id="reviewModalLabel">Review factory</h5>
			  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click="closeModal"></button>
			</div>
			<div class="modal-body">
			  <label class="form-label">Rating: {{ comment.factoryRating }}</label>
			  <input type="range" class="form-range" min="1" max="5" v-model="comment.factoryRating" />
			  <br><br>
			  <div class="d-flex justify-content-between">
				<label class="form-label">Your comment</label>
				<label>{{ comment.text.length }} / 256</label>
			  </div>
			  <textarea class="form-control" rows="5" maxlength="256" v-model="comment.text" />
			  <br>
			  <div class="errorText">{{ errorMessage }}</div>
			</div>
			<div class="modal-footer">
			  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="closeModal">Close</button>
			  <button type="button" class="btn btn-primary" v-on:click="submitReview" data-bs-dismiss="modal">Submit</button>
			</div>
		  </div>
		</div>
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
			  <div class="text-danger" v-if="errorMessage">{{ errorMessage }}</div>
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
			fullname: '',
			rejectReason: '',
			factoryRating: 1,
			comment: {
				factoryRating: 1,
				text: ''
			},
			errorMessage: ''
		}
	},
	mounted() {
		this.role = getUserProfile().role;
		this.getChocolates();

		axiosInstance.get('/user/fullname', {
			params: {
				username: this.purchase.username
			}
		})
		.then((response) => {
			this.fullname = response.data.fullname;
		})
		.catch((error) => {
			alert(error);
			console.error('Error fetching fullname:', error);
		});

	},
	methods: {
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
		delete() {
			axiosInstance.delete(`/purchase/delete/${this.purchase.id}`)
				.then(response => {
					this.purchase.status = 'Deleted';
					alert(response.data.message);
					location.reload();
				})
				.catch(error => {
					console.error(error);
					alert(error.response.data.message || 'An error occurred');
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
			this.errorMessage = ''; // Clear previous error message
			// Open the modal for the specific purchase ID
			const rejectModal = new bootstrap.Modal(document.getElementById(`rejectModal-${purchaseId}`));
			rejectModal.show();
		},
		confirmRejectPurchase(purchaseId) {
			if (!this.rejectReason.trim()) {
				this.errorMessage = 'Reason for rejection is required.';
				return;
			}
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
		},
		closeModal() {
			this.comment.factoryRating = 1;
			this.comment.text = '';
		},
		submitReview() {
			if (this.comment.text.length === 0) {
				this.errorMessage = 'Comment is required!';
				return;
			}

			axiosInstance.post(`/purchase/comment/${this.purchase.id}`, {
				comment: this.comment,
			})
			.then(response => {
				this.purchase.comment = this.comment;
				this.closeModal();
				location.reload();
			})
			.catch(error => {
				console.log(error.message);
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
