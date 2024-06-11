<template>
	<div class="details" :style="{ 'background-color': background}">
		<h1>{{ factory.name }}</h1>
		<div class="row justify-content-md-center">
			<div class="col col-md-2">
				<img class="factoryLogo" :src="factoryImgSrc" />
			</div>
			<div class="col col-md-2 justify-content-start">
				<p><b>Work hours:</b> {{ factory.startWorkTime }} - {{ factory.endWorkTime }}</p>
				<p><b>Status: </b> {{ factory.status }}</p>
				<p><b>Address:</b> {{ factory.location.address }}</p>
				<p><b>Zip:</b> {{ factory.location.zip }}</p>
				<h5><b>Rating:</b> {{ factory.rating.toPrecision(2) }} / 5</h5>
			</div>
		</div>
	</div>
	<div class="chocolates">
		<h2>Chocolates</h2>
		<div class="container d-flex flex-wrap justify-content-center">
			<ChocolateCard v-for="chocolate in chocolates" :key="chocolate.id" :chocolate="chocolate" />
		</div>
	</div>
	<div class="comments">
		<h2>Comments</h2>
	</div>
</template>

<script>

import axiosInstance, { baseURL, getUserProfile } from '@/utils/axiosInstance';

import ChocolateCard from '@/components/ChocolateCard.vue';

export default {
	name: 'DetailedFactoryView',
	components: {
		ChocolateCard
	},
	data() {
		return {
			factory: {
				rating: 0,
				location: {},
				status: 'OPEN'},
			factoryImgSrc: '',
			chocolates: [],
			background: 'white'
		}
	},
	mounted() {
		axiosInstance.get(`/factory/${this.$route.query.factoryId}`)
		.then((response) => {
			this.factory = response.data;

			const isOpen = this.isFactoryOpen(this.factory.startWorkTime, this.factory.endWorkTime);
			this.factory.status = isOpen ? 'OPEN' : 'CLOSED';
			this.background = isOpen ? 'white' : 'lightgray';

			axiosInstance.get(`/chocolate/factory/${this.factory.id}`)
			.then((response) => {
				this.chocolates = response.data;
				this.chocolates = this.filterOutOfStockChocolates(this.chocolates);
			})
			.catch((error) => {
				console.log(error);
			});
			this.factoryImgSrc = `${baseURL}/factory/img/${this.factory.id}`;
		}).catch((error) => {
			console.log(error.message);
		});
	},
	methods: {
		isFactoryOpen(startWorkTime, endWorkTime) {
			const now = new Date();
			const start = new Date();
			const end = new Date();

			start.setHours(startWorkTime.split(':')[0], startWorkTime.split(':')[1]);
			end.setHours(endWorkTime.split(':')[0], endWorkTime.split(':')[1]);

			return now >= start && now <= end;
		},
		filterOutOfStockChocolates(chocolates) {
			const role = getUserProfile().role;
			if (role === 'customer' || role === null)
				return chocolates.filter(chocolate => chocolate.quantity > 0);
			else
				return chocolates;
		}
	}
}

</script>

<style scoped>

h1 {
	padding-bottom: 2%;
	text-align: center;
}

h2 {
	text-align: center;
}

.details {
	padding-top: 2%;
	padding-bottom: 2%;
	border-bottom: 1px solid lightgray;
}

.factoryLogo {
	max-width: 100%;
	max-height: 100%;
	border-radius: 5%;
}

.chocolates {
	padding-top: 2%;
	padding-bottom: 2%;
	justify-content: center;
	border-bottom: 1px solid lightgray;
}

.comments {
	padding-top: 2%;
	text-align: center;
}
</style>