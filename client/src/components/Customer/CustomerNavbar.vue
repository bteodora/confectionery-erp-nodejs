<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand">
				<img src="../../assets/img/chocolate.png" alt="" width="30" height="24" class="d-inline-block align-text-top">
      			Choco factory
			</a>
			<div class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item">
					<router-link class="nav-link" to="/customer">Factories</router-link>
				</li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/customer/cart">Cart</router-link>
                </li>
				<li>
					<router-link class="nav-link" to="/customer/purchases">Purchases</router-link>
				</li>
			</div>
			<a class="navbar-brand">{{ username }}</a>
			<div class="btn-group">
				<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
					aria-expanded="false">
					Menu
				</button>
				<ul class="dropdown-menu dropdown-menu-end">
					<li><router-link to="/customer/profile" class="dropdown-item" type="button">Edit profile</router-link></li>
					<li><button class="dropdown-item" type="button" v-on:click="logout()">Logout</button></li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>

import axiosInstace, { logoutUser, getUserProfile } from '@/utils/axiosInstance';

export default {
	name: 'CustomerNavbar',
	data() {
		return {
			username: '',
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

<style scoped>
</style>