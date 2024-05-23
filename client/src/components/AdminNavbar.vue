<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand">
				<img src="../assets/chocolate.png" alt="" width="30" height="24" class="d-inline-block align-text-top">
      			Choco factory
			</a>
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
						data-bs-toggle="dropdown" aria-expanded="false">
						Factories
					</a>
					<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
						<li><a class="dropdown-item" href="#">Add new</a></li>
						<li><router-link class="dropdown-item" to="/admin">Show all</router-link></li>
					</ul>
				</li>
				<li class="nav-item">
					<router-link class="nav-link" aria-current="page" to="/admin/showallusers">Users</router-link>
				</li>
			</ul>

			<a class="navbar-brand">{{ username }}</a>
			<div class="btn-group">
				<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
					aria-expanded="false">
					Menu
				</button>
				<ul class="dropdown-menu dropdown-menu-end">
					<li><router-link class="dropdown-item" >Edit profile</router-link></li>
					<li><button class="dropdown-item" v-on:click="logout()">Logout</button></li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>

import axiosInstace, { logoutUser } from '@/utils/axiosInstance';

export default {
	name: 'AdminNavbar',
	data() {
		return {
			username: '',
			role: ''
		}
	},
	mounted() {
		axiosInstace.get('/user/profile')
			.then((response) => {
				this.username = response.data.username;
			})
			.catch((error) => {
				console.log(error);
			});
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