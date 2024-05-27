<template>
	<div class="mb-3">
		<label class="form-label">Username</label>
		<input type="text" class="form-control" v-model="username" />
	</div>
	<div class="mb-3">
		<label class="form-label">Password</label>
		<input type="password" class="form-control" v-model="password_1" />
	</div>
	<div class="mb-3">
		<label class="form-label">Re-type password</label>
		<input type="password" class="form-control" v-model="password_2" />
	</div>
	<div class="mb-3">
		<label class="form-label">Name</label>
		<input type="text" class="form-control" v-model="name" />
	</div>
	<div class="mb-3">
		<label class="form-label">Surname</label>
		<input type="text" class="form-control" v-model="surname" />
	</div>
	<div class="mb-3">
		<label class="form-label">Gender</label>
		<select class="form-select" v-model="gender">
			<option value="male">Male</option>
			<option value="female">Female</option>
		</select>
	</div>
	<div class="mb-3">
		<label class="form-label">Birthdate</label>
		<input type="date" class="form-control" v-model="birth_date" />
	</div>
	<div class="errorText">{{ errorMessage }}</div><br>
	<button class="btn btn-primary" v-on:click="register()">Submit</button>
</template>

<script>

import axiosInstace from '@/utils/axiosInstance';

export default {
	data() {
		return {
			username: '',
			password_1: '',
			password_2: '',
			name: '',
			surname: '',
			gender: '',
			birth_date: '',
			errorMessage: ''
		}
	},
	props: {
		role: {
			type: String,
			required: true
		},
		endpoint: {
			type: String,
			required: true
		}
	},
	methods: {
		register() {
			if (this.username === '' || this.password_1 === '' || this.password_2 === '' || this.name === '' || this.gender === '' || this.surname === '' || this.birth_date === '') {
				this.errorMessage = 'All fields are required!';
				return;
			}

			if (this.password_1 !== this.password_2) {
				this.errorMessage = 'Passwords do not match!';
				return;
			}

			axiosInstace.post(this.endpoint, {
				username: this.username,
				password: this.password_1,
				name: this.name,
				surname: this.surname,
				gender: this.gender,
				birth_date: this.birth_date
			}).then(response => {
				alert(response.data.message);
				this.refresh();
				this.$emit('registerSuccess');
			}).catch(error => {
				this.errorMessage = error.response.data.message;
			});
		},
		refresh() {
			this.errorMessage = '';
			this.username = '';
			this.password_1 = '';
			this.password_2 = '';
			this.name = '';
			this.surname = '';
			this.birth_date = '';
			this.gender = '';
		}
	}
}

</script>

<style scoped>
</style>