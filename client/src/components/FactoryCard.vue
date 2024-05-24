<template>
	<div class="card" style="width: 25rem;"
	:style="{ 'background-color': cardBackgroundColor}">
		<img src="..." class="card-img-top"><br>
		<div class="card-body">
			<h5 class="card-title">{{ factory.name }}</h5><br>
			<p class="card-text"><b>Status: {{ status }}</b></p>
			<p class="card-text">Address: {{ factory.location.address }}</p>
			<p class="card-text">City: {{ factory.location.city }}</p>
			<p class="card-text">Rating: {{ factory.rating.toPrecision(2) }} / 5</p>
			<br><button class="btn btn-primary" :disabled="!factory.isOpen">Details</button>
		</div>
	</div>
</template>

<script>

import router from '@/router';
import axiosInstance from '@/utils/axiosInstance';

export default {
	name: 'FactoryCard',
	data() {
		return {
			cardBackgroundColor: 'white',
			status: 'OPEN'
		}
	},
	props: {
		factory: Object,
		viewingRole: String
	},
	mounted() {
		if (!this.factory.isOpen) {
			this.cardBackgroundColor = 'lightgray';
		}

		if(!this.factory.isOpen) {
			this.status = 'CLOSED';
		}
	},
}

</script>

<style scoped>

.card {
	border-radius: 10px;
	box-shadow: 2px 2px 2px lightblue;
}

</style>