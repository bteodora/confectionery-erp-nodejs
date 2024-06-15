<template>
	<div class="card">
		<div class="card-header d-flex justify-content-between">
			<label>{{ comment.username }}</label>
			<label>{{ formatDate(comment.creationDate) }}</label>
		</div>
		<ul class="list-group list-group-flush">
			<li class="list-group-item">Rating: {{ comment.factoryRating }}</li>
		</ul>
		<div class="card-body">
			<p class="card-text">{{ comment.text }}</p>
			<div class="d-flex justify-content-end">
				<button v-if="role === 'manager'" class="btn btn-success me-2" @click="approveComment">Approve</button> // add v-if comment.status === Pending
				<button v-if="role === 'manager'" class="btn btn-danger" @click="rejectComment">Reject</button>
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
			role: ''
		};
	},
	mounted() {
		this.role = getUserProfile().role;
		alert(this.role);
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
		approveComment() {
			alert("approve")
		},
		rejectComment() {
			alert("reject")
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
