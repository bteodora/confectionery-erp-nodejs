<template>
	<div>
		<ManagerNavbar/>
		<div class="container d-flex flex-wrap justify-content-center">
		    <PurchaseCard v-for="purchase in purchases" :key="purchase.id" :purchase="purchase" />
		    <p v-if="purchases.length === 0" class="no-purchases"><i>No purchases...</i></p>
	    </div>
	</div>
</template>

<script>
import ManagerNavbar from '@/components/Manager/ManagerNavbar.vue';
import PurchaseCard from '@/components/PurchaseCard.vue';
import axiosInstance, { getUserProfile } from '@/utils/axiosInstance';

export default {
	name: 'ManagerPurchasesView',
	components: {
		PurchaseCard,
		ManagerNavbar
	},
	data() {
		return {
			purchases: []
		}
	},
	mounted() {
		axiosInstance.get(`/purchase/byfactory`)
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