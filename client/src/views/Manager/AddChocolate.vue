<template>
	<ManagerNavbar/>
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
				<option value="mixed">Mixed</option>
			</select>
		</div>
		<div class="mb-3">
			<label class="form-label">Category</label>
			<select class="form-select" v-model="category">
				<option value="cooking">Chocolate for cooking</option>
				<option value="drinking">For drinking</option>
				<option value="regular">Regular</option>
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
import ManagerNavbar from '@/components/Manager/ManagerNavbar.vue';
import axiosInstance from '@/utils/axiosInstance';

export default {
	name: 'RegisterChocolate',
	components: {
		ManagerNavbar
	},
	data() {
		return {
			name: '',
			price: '',
			type: '',
			category: '',
			weight: '',
			description: '',
			errorMessage: '',
			isDeleted: false,
			factoryId: null
		};
	},

	mounted() {
    axiosInstance.get('/user/factoryid')
        .then((response) => {     
            this.factoryId = response.data.factoryId;
        })
        .catch((error) => {
			alert(error);
            console.error('Error fetching factoryId:', error);
        });
	},

	methods: {
		validate() {
			if (this.name === '' || this.price === '' || this.type === '' || this.weight === '' || this.description === ''|| this.category==='') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.price <= 0) {
				this.errorMessage = 'Price must be greater than 0';
				return false;
			}
			if (this.weight <= 0) {
				this.errorMessage = 'Weight must be greater than 0 grams';
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
				const response1 = await axiosInstance.post('/chocolate/createchocolate', {
					name: this.name,
					price: this.price,
					type: this.type,
					weight: this.weight,
					description: this.description,
					factoryId : this.factoryId,
					category: this.category,
					isDeleted: this.isDeleted
				});
				const chocolateId = response1.data.chocoId;
				const img = this.$refs.fileInput.files[0];
				const formData = new FormData();
				formData.append('img', img);
				// alert('setovanje img path-a')
				const response2 = await axiosInstance.post(`/chocolate/img/upload/${chocolateId}`, formData);

				alert(response1.data.message + '\n' + response2.data.message);
				this.$router.push('/manager/allchocolate');
			} catch (error) {
				this.errorMessage = error.response.data.message;
				console.error(error);
				alert(error);
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
