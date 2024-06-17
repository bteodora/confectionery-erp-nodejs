<template>
	<div class="card">
		<div class="card-header d-flex justify-content-between">
			<label>{{ comment.username }}</label>
			<label>{{ formatDate(comment.creationDate) }}</label>
		</div>
		<ul class="list-group list-group-flush">
			<li v-if="role === 'manager' || role === 'admin'" class="list-group-item">Status: {{ comment.status }}</li>
			<li class="list-group-item">Rating: {{ comment.factoryRating }}</li>
		</ul>
		<div class="card-body">
			<p class="card-text">{{ comment.text }}</p>
			<div class="d-flex justify-content-end">
				<button v-if="role === 'manager' && comment.status === 'Pending'" class="btn btn-success me-2" @click="approveComment">Approve</button>
				<button v-if="role === 'manager' && comment.status === 'Pending'" class="btn btn-danger" @click="rejectComment">Reject</button>
			</div>
		</div>
	</div>
</template>

<script>

import axiosInstance, { getUserProfile } from '@/utils/axiosInstance';

export default {
	name: 'CommentCard',
	props: {
		comment: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			role: '',
			userFactoryId: 0
		};
	},
	mounted() {
		this.role = getUserProfile().role;
		axiosInstance.get('/user/factoryid')
			.then((response) => {
				this.userFactoryId = response.data.factoryId;
			})
			.catch((error) => {
				alert(error);
				console.error('Error fetching factoryId:', error);
			});
	},
	methods: {
		formatDate(dateString) {
			let date = new Date(dateString);
			let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
			let timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
			let formattedDate = date.toLocaleDateString(undefined, dateOptions);
			let formattedTime = date.toLocaleTimeString(undefined, timeOptions);
			return `${formattedDate} ${formattedTime}`;
		},
		checkFactoryIds(){
			if(this.userFactoryId != this.comment.factoryId){
				alert("You can not reject or accept comments from factory that is not yours!");
				return false;
			}
			return true;
		},
		approveComment() {
			if(!this.checkFactoryIds()){
				return;
			}
			axiosInstance.post('/purchase/commentapprove', this.comment)
				.then(response => {
					this.comment.status = 'Approved';
					alert(response.data.message);
				})
				.catch(error => {
					console.error(error);
					alert(error.response.data.message || 'An error occurred');
				});
		},
		rejectComment() {
			if(!this.checkFactoryIds()){
				return;
			}
			axiosInstance.post('/purchase/commentreject', this.comment)
				.then(response => {
					this.comment.status = 'Rejected';
					alert(response.data.message);
				})
				.catch(error => {
					console.error(error);
					alert(error.response.data.message || 'An error occurred');
				});
		}
	}
}
</script>

<style scoped>
.card {
	margin: 2%;
	max-width: 50%;
	min-width: 25%;
	border-radius: 10px;
}
.btn {
	margin: 5px;
}
</style>
