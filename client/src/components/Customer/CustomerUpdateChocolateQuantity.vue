<template>
	<div class="modal-dialog modal-sm">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="quantityModalLabel">Select chocolate quantity</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
		<div class="modal-body">
			<div class="container" style="width: 100%;">
				<div class="mb-3 d-flex align-items-center">
					<button class="btn btn-secondary" @click="decreaseQuantity">-</button>
					<input type="number" class="form-control mx-2" v-model="newQuantity" readonly style="text-align: center;"/>
					<button class="btn btn-secondary" @click="increaseQuantity">+</button>
				</div>
				<div class="errorText">{{ quantityErrorMessage }}</div>
			</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			<button type="button" class="btn btn-primary" @click="confirm">Confirm</button>
		</div>
		</div>
	</div>
</template>

<script>

import axiosInstace from '@/utils/axiosInstance';

export default {
	name: 'CustomerUpdateChocolateQuantity',
	props: {
		chocolate: Object,
		endpoint: String,
	},
	data() {
		return {
			newQuantity: 1,
			quantityErrorMessage: ''
		}
	},
	methods: {
		increaseQuantity() {
			if (this.newQuantity < this.chocolate.quantity)
				this.newQuantity++;
		},
		decreaseQuantity() {
			if (this.newQuantity > 1)
				this.newQuantity--;
		},
		confirm() {
			axiosInstace.put(this.endpoint, {
				factoryId: this.chocolate.factoryId,
				id: this.chocolate.id,
				selectedQuantity: this.newQuantity
			}).then((response) => {
				location.reload();
				alert('Chocolate quantity successfully updated!');
			}).catch((error) => {
				this.quantityErrorMessage = error.response.data.message;
			});
		},
		refresh(selectedQuantity) {
			this.newQuantity = selectedQuantity;
		}
	}
}

</script>

<style></style>