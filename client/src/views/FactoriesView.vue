<template>

	<nav class="navbar navbar-dark bg-dark">
		<div class="container justify-content-center w-75">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
				<span class="navbar-toggler-icon"></span>
				Search, filter, sort
			</button>
			<div class="collapse navbar-collapse m-3" id="collapsibleNavbar">
				<ul class="navbar-nav align-items-center m-2">
					<input class="form-control w-50 m-2" type="text" placeholder="Factory name" v-model="search_facetory_name">
					<input class="form-control w-50 m-2" type="text" placeholder="Chocolate name" v-model="search_chocolate_name">
					<input class="form-control w-50 m-2" type="text" placeholder="City" v-model="search_city">
					<input class="form-control w-50 m-2" type="number" placeholder="Rating" v-model="search_rating"
						min="0" max="5" step="0.25" >

					<div class="container text-center w-50 m-2">
						<div class="row">
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="applySearchAndFilter()">Search</button>
							</div>
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="clearSearch()">Clear search</button>
							</div>
						</div>
					</div>
				</ul>
				<ul class="navbar-nav align-items-center m-2">
					<select class="form-select w-50 m-2" v-model="filter_status">
						<option value="" selected :disabled="filter_status !== ''">Select status</option>
						<option value=true>OPEN</option>
						<option value=false>CLOSED</option>
					</select>
					<div class="container w-50 m-2">
						<div class="row">
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="applySearchAndFilter()">Filter</button>
							</div>
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="clearFilter()">Clear filter</button>
							</div>
						</div>
					</div>
				</ul>
				<ul class="navbar-nav align-items-center m-2">
					<div class="container w-50">
						<div class="row">
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="sortByFactoryName()">Sort by
									factory name</button>
							</div>
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="sortByCity()">Sort by city</button>
							</div>
						</div>
						<div class="row mt-3">
							<div class="col-12">
								<button class="btn btn-secondary w-100" v-on:click="sortByRating()">Sort by
									rating</button>
							</div>
						</div>
					</div>
				</ul>
			</div>
		</div>
	</nav>

	<div class="card-container">
		<FactoryCard v-for="factory in filtered_factories" :factory="factory" :key="factory.id" :viewingRole="viewingRole" />
	</div>

</template>

<script>

import axiosInstance, { getUserProfile } from '@/utils/axiosInstance';
import FactoryCard from '@/components/FactoryCard.vue';

export default {
	name: 'FactoriesView',
	components: {
		FactoryCard
	},
	data() {
		return {
			factories: [],
			filtered_factories: [],
			viewingRole: '',
			search_factory_name: '',
			search_chocolate_name: '',
			search_city: '',
			search_rating: '',
			filter_status: '',
			sortByFactoryNameAsc: true,
			sortByCityAsc: true,
			sortByRatingAsc: true
		}
	},
	mounted() {
		this.viewingRole = getUserProfile().role;

		this.getFactories()
	},
	methods: {
		getFactories() {
			axiosInstance.get('/factory')
			.then((response) => {
				this.factories = response.data;
				this.factories = this.factories.map(f => {
					f.isOpen = this.isFactoryOpen(f.startWorkTime, f.endWorkTime);
					return f;
				})
				this.filtered_factories = this.factories
			})
			.catch((error) => {
				console.log(error);
			});
		},
		applySearchAndFilter() {
			this.filtered_factories = this.factories
			this.search();
			this.filter();
		},
		search() {
			this.filtered_factories = this.filtered_factories.filter(f => {
				return f.name.toLocaleLowerCase().includes(this.search_factory_name.toLocaleLowerCase()) &&
					f.location.city.toLocaleLowerCase().includes(this.search_city.toLocaleLowerCase())
			})

		},
		filter() {
			if (this.filter_status === '')
				return

			this.filtered_factories = this.filtered_factories.filter(f => f.isOpen === JSON.parse(this.filter_status))
		},
		clearSearch() {
			this.search_factory_name = '';
			this.search_chocolate_name = '';
			this.search_city = '';
			this.applySearchAndFilter();
		},
		clearFilter() {
			this.filter_status = ''
			this.applySearchAndFilter();
		},
		sortByFactoryName() {
			this.sortByFactoryNameAsc = !this.sortByFactoryNameAsc;
			this.filtered_factories = this.filtered_factories.sort((a, b) => {
				return a.name.localeCompare(b.name);
			});

			if (this.sortByFactoryNameAsc) {
				this.filtered_factories = this.filtered_factories.reverse();
			}
		},
		sortByCity() {
			this.sortByCityAsc = !this.sortByCityAsc;
			this.filtered_factories = this.filtered_factories.sort((a, b) => {
				return a.location.city.localeCompare(b.location.city);
			});

			if (this.sortByCityAsc) {
				this.filtered_factories = this.filtered_factories.reverse();
			}
		},
		sortByRating() {
			this.sortByRatingAsc = !this.sortByRatingAsc;
			this.filtered_factories = this.filtered_factories.sort((a, b) => {
				return a.rating - b.rating
			});

			if (this.sortByRatingAsc) {
				this.filtered_factories = this.filtered_factories.reverse();
			}
		},
		isFactoryOpen(startWorkTime, endWorkTime) {
			const now = new Date();

			const [startHour, startMinute] = startWorkTime.split(':').map(Number);
			const [endHour, endMinute] = endWorkTime.split(':').map(Number);

			const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
			const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

			return now >= startDate && now <= endDate;
		}
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