<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand">
				<img src="../../assets/img/chocolate.png" alt="" width="30" height="24" class="d-inline-block align-text-top">
      			Choco factory
			</a>
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
						data-bs-toggle="dropdown" aria-expanded="false">
						Factories
					</a>
					<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
						<li><router-link class="dropdown-item" to="/admin/registerfactory">Register new factory</router-link></li>
						<li><router-link class="dropdown-item" to="/admin">Show all</router-link></li>
					</ul>
				</li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
						data-bs-toggle="dropdown" aria-expanded="false">
						Users
					</a>
					<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
						<li><router-link class="dropdown-item" to="/admin/registermanager">Register new manager</router-link></li>
						<li><router-link class="dropdown-item" to="/admin/showallusers">Show all</router-link></li>
					</ul>					
				</li>
				<li class="nav-item">
                    <router-link class="nav-link" to="/admin/purchases">Purchases</router-link>
                </li>
			</ul>

			<a class="navbar-brand">{{ username }}</a>
			<div class="btn-group">
				<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
					aria-expanded="false">
					Menu
				</button>
				<ul class="dropdown-menu dropdown-menu-end">
					<li><router-link class="dropdown-item" to="/admin/profile">Profile</router-link></li>
					<li><button class="dropdown-item" v-on:click="logout()">Logout</button></li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>

import axiosInstace, { getUserProfile, logoutUser } from '@/utils/axiosInstance';

export default {
	name: 'AdminNavbar',
	data() {
		return {
			username: '',
			role: ''
		}
	},
	mounted() {
		this.username = getUserProfile().username;
	},
	methods: {
		logout() {
			logoutUser();
			this.$router.push('/');
		}
	}
}
</script>

<style scoped></style>