<template>
	<div>
		<AdminNavbar />
		<nav class="navbar navbar-dark bg-dark">
			<div class="container justify-content-center w-75">
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
					<span class="navbar-toggler-icon"></span>
					Search, filter, sort
				</button>
				<div class="collapse navbar-collapse m-3" id="collapsibleNavbar">
					<ul class="navbar-nav align-items-center m-2">
						<input class="form-control w-50 m-2" type="text" placeholder="Factory Name" v-model="search_factory_name">
						<div class="input-group w-50 m-2">
							<span class="input-group-text">Price From</span>
							<input type="number" class="form-control" v-model="search_price_from">
							<span class="input-group-text">To</span>
							<input type="number" class="form-control" v-model="search_price_to">
						</div>
						<div class="input-group w-50 m-2">
							<span class="input-group-text">Date From</span>
							<input type="date" class="form-control" v-model="search_date_from">
							<span class="input-group-text">To</span>
							<input type="date" class="form-control" v-model="search_date_to">
						</div>
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
						<div class="container w-50">
							<div class="row">
								<div class="col-12" v-if="role === 'admin'">
									<button class="btn btn-secondary w-100 m-2" v-on:click="sortByFactoryName()">Sort by Factory Name</button>
								</div>
								<div class="col-12">
									<button class="btn btn-secondary w-100 m-2" v-on:click="sortByTotalPrice()">Sort by Total Price</button>
								</div>
								<div class="col-12">
									<button class="btn btn-secondary w-100 m-2" v-on:click="sortByDate()">Sort by Date</button>
								</div>
							</div>
						</div>
					</ul>
				</div>
			</div>
		</nav>
		<div class="container d-flex flex-wrap justify-content-center">
			<PurchaseCard v-for="purchase in filtered_purchases" :key="purchase.id" :purchase="purchase" />
			<p v-if="filtered_purchases.length === 0" class="no-purchases"><i>No purchases...</i></p>
		</div>
	</div>
</template>




<script>
import AdminNavbar from '@/components/Admin/AdminNavbar.vue';
import PurchaseCard from '@/components/PurchaseCard.vue';
import axiosInstance, { getUserProfile } from '@/utils/axiosInstance';

export default {
	name: 'AdminPurchasesView',
	components: {
		PurchaseCard,
		AdminNavbar
	},
	data() {
		return {
			role: '',
			purchases: [],
			filtered_purchases: [],
			search_factory_name: '',
			search_price_from: '',
			search_price_to: '',
			search_date_from: '',
			search_date_to: '',
			sortByFactoryNameAsc: true,
			sortByTotalPriceAsc: true,
			sortByDateAsc: true
		}
	},
	mounted() {
		this.role = getUserProfile().role;
		axiosInstance.get(`/purchase/all`)
			.then(response => {
				this.purchases = response.data;
				this.fetchFactoryNames();
				this.filtered_purchases = this.purchases;
			})
			.catch(error => {
				console.error(error);
			});
	},
	methods: {
		fetchFactoryNames() {
			this.purchases.forEach(purchase => {
				axiosInstance.get(`/factory/${purchase.factoryId}`)
					.then(response => {
						purchase.factoryName = response.data.name;
					})
					.catch(error => {
						console.error(error);
					});
			});
		},
		applySearchAndFilter() {
			this.filtered_purchases = this.purchases;
			this.search();
			this.filter();
		},
		search() {
			this.filtered_purchases = this.filtered_purchases.filter(purchase => {
				return (!this.search_factory_name || (purchase.factoryName && purchase.factoryName.toLocaleLowerCase().includes(this.search_factory_name.toLocaleLowerCase())))
			});
		},
		filter() {
			this.filtered_purchases = this.filtered_purchases.filter(purchase => {
				const priceCondition = (!this.search_price_from || purchase.totalPrice >= this.search_price_from) &&
					(!this.search_price_to || purchase.totalPrice <= this.search_price_to);
				const dateCondition = (!this.search_date_from || new Date(purchase.creationDate) >= new Date(this.search_date_from)) &&
					(!this.search_date_to || new Date(purchase.creationDate) <= new Date(this.search_date_to));
				return priceCondition && dateCondition;
			});
		},
		clearSearch() {
			this.search_factory_name = '';
			this.search_price_from = '';
			this.search_price_to = '';
			this.search_date_from = '';
			this.search_date_to = '';
			this.applySearchAndFilter();
		},
		sortByFactoryName() {
			this.sortByFactoryNameAsc = !this.sortByFactoryNameAsc;
			this.filtered_purchases = this.filtered_purchases.sort((a, b) => {
				return a.factoryName.localeCompare(b.factoryName);
			});
			if (this.sortByFactoryNameAsc) {
				this.filtered_purchases = this.filtered_purchases.reverse();
			}
		},
		sortByTotalPrice() {
			this.sortByTotalPriceAsc = !this.sortByTotalPriceAsc;
			this.filtered_purchases = this.filtered_purchases.sort((a, b) => {
				return a.totalPrice - b.totalPrice;
			});
			if (this.sortByTotalPriceAsc) {
				this.filtered_purchases = this.filtered_purchases.reverse();
			}
		},
		sortByDate() {
			this.sortByDateAsc = !this.sortByDateAsc;
			this.filtered_purchases = this.filtered_purchases.sort((a, b) => {
				return new Date(a.creationDate) - new Date(b.creationDate);
			});
			if (this.sortByDateAsc) {
				this.filtered_purchases = this.filtered_purchases.reverse();
			}
		}
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

.w-50 {
	width: 50% !important;
}

.input-group, .btn {
	width: 100%;
}

.btn {
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
}
</style>
