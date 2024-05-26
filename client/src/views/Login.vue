<template>
	<div class="containerCenter containerBorder col-3">
		<h3 class="bg-secondary formHeader">Login to Choco factory</h3>
		<div class="my-3">
			<label class="form-label">Username</label>
			<input type="text" class="form-control" id="inputUsername" v-model="username">
		</div>
		<div class="mb-3">
			<label class="form-label">Password</label>
			<input type="password" class="form-control" id="inputPassword" v-model="password">
		</div>
		<div id="error" class="form-text">{{ errorMessage }}</div><br>
		<button class="btn btn-primary" v-on:click="login()">Submit</button>
	</div>
</template>

<script>

import axiosInstace from '@/utils/axiosInstance';

export default {
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
				localStorage.setItem('jwt', response.data.token);

				if(response.data.role === 'admin') {
					this.$router.push('/admin');
				}
				else if(response.data.role === 'customer') {
					this.$router.push('/customer');
				}
				else if(response.data.role === 'manager') {
					this.$router.push('/manager');
				}
				else if(response.data.role === 'staff') {
					this.$router.push('/staff');
				}
				else {
					this.$router.push('/');
				}
			}).catch(error => {
				this.errorMessage = error.response.data.message;
			});
		}
	}
}

</script>

<style scoped>

.containerBorder {
	border: 1px solid black;
	border-radius: 10px;
}

.containerCenter {
	padding: 20px;
}


#error {
	color: red;
	font-size: 15px;
}

</style>