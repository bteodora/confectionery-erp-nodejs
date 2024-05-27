<template>
	<AdminNavbar />
	<div class="container" style="width: 35%;">
		<h3 class="bg-secondary formHeader">Register Chocolate</h3><br>
		<div class="mb-3">
			<label class="form-label">Name</label>
			<input type="text" class="form-control" v-model="name" />
		</div>
		<div class="mb-3">
			<label class="form-label">Price</label>
			<input type="number" class="form-control" v-model="price" />
		</div>
		<div class="mb-3">
			<label class="form-label">Type</label>
			<select class="form-select" v-model="type">
				<option value="black">Black</option>
				<option value="white">White</option>
				<option value="milk">Milk</option>
			</select>
		</div>
		<div class="mb-3">
			<label class="form-label">Weight (grams)</label>
			<input type="number" class="form-control" v-model="weight" />
		</div>
		<div class="mb-3">
			<label class="form-label">Description</label>
			<textarea class="form-control" v-model="description"></textarea>
		</div>
		<div class="mb-3">
			<label class="form-label">Picture</label>
			<input class="form-control" type="file" ref="fileInput" />
		</div>
		<div class="errorText">{{ errorMessage }}</div><br>
		<button class="btn btn-primary" v-on:click="register()">Submit</button>
	</div>
</template>

<script>
import AdminNavbar from '@/components/Admin/AdminNavbar.vue';
import axiosInstance from '@/utils/axiosInstance';

export default {
	name: 'RegisterChocolate',
	components: {
		AdminNavbar
	},
	data() {
		return {
			name: '',
			price: '',
			type: '',
			weight: '',
			description: '',
			errorMessage: ''
		};
	},
	methods: {
		validate() {
			if (this.name === '' || this.price === '' || this.type === '' || this.weight === '' || this.description === '') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.$refs.fileInput.files.length === 0) {
				this.errorMessage = 'Picture is required';
				return false;
			}
			return true;
		},
		async register() {
			if (!this.validate()) return;

			try {
				const response1 = await axiosInstance.post('/chocolate/register', {
					name: this.name,
					price: this.price,
					type: this.type,
					weight: this.weight,
					description: this.description
				});

				const chocolateId = response1.data.chocolateId;
				const img = this.$refs.fileInput.files[0];
				const formData = new FormData();
				formData.append('img', img);

				// const response2 = await axiosInstance.post(`/chocolate/img/upload/${chocolateId}`, formData);

				// alert(response1.data.message + '\n' + response2.data.message);
				// this.$router.push('/admin');
			} catch (error) {
				this.errorMessage = error.response.data.message;
				console.error(error);
			}
		}
	}
};
</script>

<style scoped>
.container {
	margin-top: 50px;
	margin-bottom: 100px;
	margin-left: auto;
	margin-right: auto;
}
.errorText {
	color: red;
}
</style>
