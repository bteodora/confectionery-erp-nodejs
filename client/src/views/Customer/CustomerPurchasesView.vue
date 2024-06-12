<template>

	<CustomerNavbar />
	<div class="container d-flex flex-wrap justify-content-center">
		<PurchaseCard v-for="purchase in purchases" :key="purchase.id" :purchase="purchase" />
		<p v-if="purchases.length === 0" class="no-purchases"><i>No purchases...</i></p>
	</div>
</template>

<script>

import PurchaseCard from '@/components/PurchaseCard.vue';
import CustomerNavbar from '@/components/Customer/CustomerNavbar.vue';
import axiosInstance, { getUserProfile } from '@/utils/axiosInstance';

export default {
	name: 'CustomerPurchasesView',
	components: {
		PurchaseCard,
		CustomerNavbar
	},
	data() {
		return {
			purchases: []
		}
	},
	mounted() {
		axiosInstance.get(`/purchase/byuser`)
			.then(response => {
				this.purchases = response.data;
			})
			.catch(error => {
				console.error(error);
			});
	}
}

</script>

<style scoped>

.container {
	padding-top: 2%;
}

.no-purchases {
	font-size: 20px;
	padding-top: 5%;
}
</style>