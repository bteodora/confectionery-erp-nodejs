<template>
	<div class="card" :class="{ 'blocked': user.isBlocked }" style="width: 20rem;">
		<h5 class="card-header">{{ user.role[0].toUpperCase() + user.role.slice(1) }}
			<i>{{ headerInfo }}</i></h5>
		<div class="card-body">
			<p class="card-title"><b>{{ user.username }}</b></p><br>
			<p class="text">Name: {{ user.name + " " + user.surname }}</p>
			<p class="text">Gender: {{ user.gender }}</p>
			<p class="text">Birth date: {{ user.birth_date }}</p>
			<p class="text" v-if="user.points != undefined">Points: {{ user.points.toFixed(2) }}</p>
			<p class="text" v-else>&nbsp;</p>
			<div class="text-end">
				<button class="btn btn-danger" v-if="user.role !== 'admin' && !user.isBlocked" v-on:click="blockUser">Block</button>
			</div>
		</div>
	</div>
</template>

<script>

import axiosInstance from '@/utils/axiosInstance';

export default {
	name: 'UserCard',
	props: {
		user: {
			type: Object,
			required: true,
			default: { points: 0 }
		}
	},
	data() {
		return {
			headerInfo: ''
		}
	},
	mounted() {
		if(this.user.role !== 'customer')
			return;

		if(this.user.isSuspicious)
			this.headerInfo = '(SUSPICIOUS)';
		else
			this.headerInfo = `(${this.user.type})`;

	},
	methods: {
		blockUser() {
			axiosInstance.delete(`/user/block/${this.user.username}`)
				.then(res => {
					this.user.isBlocked = true;
				})
				.catch(error => {
					console.error(error);
				});
		}
	}
}

</script>

<style>

.card {
	background-color: white;
	margin: 20px;
	border-radius: 10px;
	box-shadow: 2px 2px 2px lightblue;
}

.blocked {
	background-color: lightcoral;
}

</style>