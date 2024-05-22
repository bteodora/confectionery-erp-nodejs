<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand">Choco factory</a>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
			</div>
			<a class="navbar-brand">{{ username }}</a>
			<div class="btn-group">
				<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
					aria-expanded="false">
					Menu
				</button>
				<ul class="dropdown-menu dropdown-menu-end">
					<li><router-link to="" class="dropdown-item" type="button">Edit profile</router-link></li>
					<li><button class="dropdown-item" type="button" v-on:click="logout()">Logout</button></li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>

import axiosInstace, { logoutUser } from '@/utils/axiosInstance';

export default {
	name: 'CustomerNavbar',
	data() {
		return {
			username: '',
		}
	},
	mounted() {
		axiosInstace.get('/user/profile')
		.then(response => {
			this.username = response.data.username;
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

<style scoped>
</style>