<template>
	<div class="card" style="width: 25rem;"
	:style="{ 'background-color': cardBackgroundColor}">
		<img :src="imgSrc" class="card-img-top"><br>
		<div class="card-body">
			<h5 class="card-title">{{ factory.name }}</h5><br>
			<p class="card-text"><b>Status: {{ status }}</b></p>
			<p class="card-text">Address: {{ factory.location.address }}</p>
			<p class="card-text">City: {{ factory.location.city }}</p>
			<p class="card-text">Rating: {{ factory.rating.toPrecision(2) }} / 5</p>
			<br><button class="btn btn-primary" v-on:click="detailsClicked()">Details</button>
		</div>
	</div>
</template>

<script>

import router from '@/router';
import axiosInstance, { baseURL, getUserProfile } from '@/utils/axiosInstance';

export default {
	name: 'FactoryCard',
	data() {
		return {
			cardBackgroundColor: 'white',
			status: 'OPEN',
			imgSrc: ''
		}
	},
	props: {
		factory: Object,
	},
	mounted() {
		if (!this.factory.isOpen) {
			this.status = 'CLOSED';
			this.cardBackgroundColor = 'lightgray';
		}

		this.imgSrc = `${baseURL}/factory/img/${this.factory.id}`;
	},
	methods: {
		detailsClicked() {

			const viewingRole = getUserProfile().role;
			let route = {query: {factoryId: this.factory.id}};

			if(viewingRole == 'admin')
				route.path = '/admin/details';
			else if(viewingRole == 'manager')
				route.path = '/manager/details';
			else if(viewingRole == 'customer')
				route.path = '/customer/details';
			else
				route.path = '/details';

			this.$router.push(route);
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

.card-img-top {
	width: 100%;
	height: 16rem;
	border-radius: 10px 10px 0px 0px;
	border-bottom: 1px solid gray;
}
</style>