<template>

<div class="card-container">
	<FactoryCard v-for="factory in factories" :factory="factory" :viewingRole="null"/>
</div>

</template>

<script>

import axiosInstance from '@/utils/axiosInstance';
import FactoryCard from '@/components/FactoryCard.vue';

export default {
	name: 'FactoriesView',
	components: {
		FactoryCard
	},
	data() {
		return {
			factories: []
		}
	},
	mounted() {
		axiosInstance.get('/factory')
			.then((response) => {
				this.factories = response.data;
			})
			.catch((error) => {
				console.log(error);
			});
	}
}

</script>

<style scoped>

.card-container {
	display: flex;
	margin-top: 2%;
	justify-content: center;
	flex-wrap: wrap;
}

</style>