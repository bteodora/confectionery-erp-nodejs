<template>

	<h3 class="bg-secondary formHeader">Profile information</h3><br>
	<div class="mb-3">
		<label class="form-label">Username</label>
		<input type="text" class="form-control" v-model="username" disabled/>
	</div>
	<div class="mb-3">
		<label class="form-label">Name</label>
		<input type="text" class="form-control" v-model="name" :disabled="isDisabled" />
	</div>
	<div class="mb-3">
		<label class="form-label">Surname</label>
		<input type="text" class="form-control" v-model="surname" :disabled="isDisabled" />
	</div>
	<div class="mb-3">
		<label class="form-label">Gender</label>
		<select class="form-select" v-model="gender" :disabled="isDisabled">
			<option value="male">Male</option>
			<option value="female">Female</option>
		</select>
	</div>
	<div class="mb-3">
		<label class="form-label">Birthdate</label>
		<input type="date" class="form-control" v-model="birth_date" :disabled="isDisabled" />
	</div>
	<div class="errorText">{{ errorMessage }}</div><br>
	<button type="button" class="btn btn-primary" v-on:click="editProfile()" :disabled="!isDisabled">Edit
		profile</button>
	<button type="button" class="btn btn-primary" v-on:click="submit()" :disabled="isDisabled">Submit</button>

</template>

<script>

import axiosInstance, { getUserProfile } from '@/utils/axiosInstance';

export default {
	name: 'EditProfile',
	data() {
		return {
			username: '',
			name: '',
			surname: '',
			gender: '',
			birth_date: '',
			errorMessage: '',
			isDisabled: true
		}
	},
	mounted() {
		this.username = getUserProfile().username

		axiosInstance.get('/user/profile')
			.then(response => {
				this.name = response.data.name;
				this.surname = response.data.surname;
				this.gender = response.data.gender;
				this.birth_date = response.data.birth_date;
			})
			.catch(error => {
				console.log(error.response.data.message);
			});
	},
	methods: {
		editProfile() {
			this.isDisabled = !this.isDisabled;
		},
		submit() {
			if (this.name === '' || this.surname === '' || this.birth_date === '') {
				this.errorMessage = 'All fields are required';
				return;
			}

			axiosInstance.put('/user/profile', {
				name: this.name,
				surname: this.surname,
				gender: this.gender,
				birth_date: this.birth_date
			})
			.then(response => {
				this.isDisabled = true;
				alert(response.data.message);
			})
			.catch(error => {
				console.log(error.response.data.message);
			})

		}
	}
}

</script>

<style scoped>


button {
	margin-right: 20px;
}
</style>