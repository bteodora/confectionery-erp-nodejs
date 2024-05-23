<template>
	<AdminNavbar />

	<nav class="navbar navbar-dark bg-dark">
		<div class="container justify-content-center w-75">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
				<span class="navbar-toggler-icon"></span>
				Search & filter
			</button>
			<div class="collapse navbar-collapse m-3" id="collapsibleNavbar">
				<ul class="navbar-nav align-items-center m-2">
					<input class="form-control w-50 m-2" type="text" placeholder="Username" v-model="search_username">
					<input class="form-control w-50 m-2" type="text" placeholder="Name" v-model="search_name">
					<input class="form-control w-50 m-2" type="text" placeholder="Surname" v-model="search_surname">
					<div class="container text-center w-50 m-2">
						<div class="row">
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="search()">Search</button>
							</div>
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="clearSearch()">Clear search</button>
							</div>
						</div>
					</div>
				</ul>
				<ul class="navbar-nav align-items-center m-2">
					<select class="form-select w-50 m-2" v-model="filter_role">
						<option value="" disabled selected>Select role</option>
						<option value="customer">Customer</option>
						<option value="manager">Manager</option>
						<option value="staff">Staff</option>
						<option value="admin">Admin</option>
					</select>
					<div class="container w-50 m-2">
						<div class="row">
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="filter()">Filter</button>
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
								<button class="btn btn-secondary w-100" v-on:click="sortByUsername()">Sort by username</button>
							</div>
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="sortByName()">Sort by name</button>
							</div>
						</div>
						<div class="row mt-3">
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="sortBySurname()">Sort by surname</button>
							</div>
							<div class="col-6">
								<button class="btn btn-secondary w-100" v-on:click="sortByPoints()">Sort by points</button>
							</div>
						</div>
					</div>
				</ul>
			</div>
		</div>
	</nav>
	<div class="card-container">
		<UserCard v-for="user in filtered_users" :user="user" />
	</div>
</template>

<script>

import AdminNavbar from '@/components/AdminNavbar.vue'
import UserCard from '@/components/UserCard.vue'
import axiosInstace from '@/utils/axiosInstance';

export default {
	name: 'ShowAllUsers',
	components: {
		AdminNavbar,
		UserCard
	},
	data() {
		return {
			users: [],
			filtered_users: [],
			search_username: '',
			search_name: '',
			search_surname: '',
			filter_role: '',
			sortByUsernameAsc: true,
			sortByNameAsc: true,
			sortBySurnameAsc: true,
			sortByPointsAsc: true
		}
	},
	mounted() {
		axiosInstace.get("/user")
			.then((response) => {
				this.users = response.data;
				this.filtered_users = this.users;
			})
	},
	methods: {
		search() {
			this.filtered_users = this.users.filter(user => {
				return user.username.toLocaleLowerCase().includes(this.search_username.toLocaleLowerCase()) &&
					user.name.toLocaleLowerCase().includes(this.search_name.toLocaleLowerCase()) &&
					user.surname.toLocaleLowerCase().includes(this.search_surname.toLocaleLowerCase())
			})
		},
		filter() {
			if (this.filter_role === '')
				return

			this.filtered_users = this.users.filter(user => user.role === this.filter_role)
		},
		clearFilter() {
			this.filter_role = '';
			this.filtered_users = this.users;
		},
		clearSearch() {
			this.search_username = '';
			this.search_name = '';
			this.search_surname = '';
			this.filtered_users = this.users;
		},
		sortByUsername() {
			this.sortByUsernameAsc = !this.sortByUsernameAsc;
			this.filtered_users = this.filtered_users.sort((a, b) => {
				return a.username.localeCompare(b.username);
			});

			if (this.sortByUsernameAsc) {
				this.filtered_users = this.filtered_users.reverse();
			}
		},
		sortByName() {
			this.sortByNameAsc = !this.sortByNameAsc;
			this.filtered_users = this.filtered_users.sort((a, b) => {
				return a.name.localeCompare(b.name);
			});

			if (this.sortByNameAsc) {
				this.filtered_users = this.filtered_users.reverse();
			}
		},
		sortBySurname() {
			this.sortBySurnameAsc = !this.sortBySurnameAsc;
			this.filtered_users = this.filtered_users.sort((a, b) => {
				return a.surname.localeCompare(b.surname);
			});

			if (this.sortBySurnameAsc) {
				this.filtered_users = this.filtered_users.reverse();
			}
		},
		sortByPoints() {
			this.sortByPointsAsc = !this.sortByPointsAsc;
			this.filtered_users = this.filtered_users.sort((a, b) => {
				return a.points - b.points
			});

			if (this.sortByPointsAsc) {
				this.filtered_users = this.filtered_users.reverse();
			}
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
	gap: 2%;
}
</style>