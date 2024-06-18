<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand">
				<img src="../../assets/img/chocolate.png" alt="" width="30" height="24"
					class="d-inline-block align-text-top">
				Choco factory
			</a>
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
						data-bs-toggle="dropdown" aria-expanded="false">
						Factories
					</a>
					<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
						<li><router-link class="dropdown-item" to="/staff">Show all</router-link></li>
						<li><button class="dropdown-item" v-on:click="showMyFactory">My factory</button></li>
					</ul>
				</li>
				<li class="nav-item">
					<router-link class="nav-link" to="/staff/chocolates">Chocolates</router-link>
				</li>
			</ul>

			<a class="navbar-brand">{{ username }}</a>
			<div class="btn-group">
				<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
					aria-expanded="false">
					Menu
				</button>
				<ul class="dropdown-menu dropdown-menu-end">
					<li><router-link class="dropdown-item" to="/staff/profile">Edit profile</router-link></li>
					<li><button class="dropdown-item" v-on:click="logout()">Logout</button></li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
import axiosInstance, { logoutUser, getUserProfile } from '@/utils/axiosInstance';

export default {
	name: 'StaffNavbar',
	data() {
		return {
			username: '',
			factoryId: ''
		};
	},
	mounted() {
		const loggedInUser = getUserProfile();
		this.username = loggedInUser.username;
		this.factoryId = loggedInUser.factoryId;
	},
	watch: {
        '$route': 'fetchData'
    },
	methods: {
		logout() {
			logoutUser();
			this.$router.push('/');
		},
		showMyFactory() {
			this.$router.push({
				path: '/staff/factorydetails',
				query: { factoryId: this.factoryId }
			});
		}
	}
};
</script>

<style scoped></style>