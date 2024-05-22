<template>
	<div class="container">
		<div class="mb-3">
			<label class="form-label">Username</label>
			<input type="text" class="form-control" id="inputUsername" v-model="username">
		</div>
		<div class="mb-3">
			<label class="form-label">Password</label>
			<input type="password" class="form-control" id="inputPassword" v-model="password">
		</div>
		<div id="error" class="form-text">{{ errorMessage }}</div><br>
		<button class="btn btn-primary" v-on:click="login()">Login</button>
	</div>
</template>

<script>

import axiosInstace from '@/utils/axiosInstance';

export default {
	name: 'LoginView',
	data() {
		return {
			username: '',
			password: '',
			errorMessage: ''
		}
	},
	methods: {
		login() {
			axiosInstace.post('/user/login', {
				username: this.username,
				password: this.password
			}).then(response => {
				alert(response.data.message);
			}).catch(error => {
				this.errorMessage = error.response.data.message;
			});
		}
	}
}

</script>

<style scoped>

.container {
	width: 20%;
	background-color: beige;
	border: 1px solid gray;
	border-radius: 15px;
	padding: 20px;
	margin-top: 100px;
}

#error {
	color: red;
	font-size: 15px;
}

</style>