<template>
	<div class="card" style="width: 20rem;">
		<h5 class="card-header">{{ user.role[0].toUpperCase() + user.role.slice(1) }}</h5>
		<div class="card-body">
			<p class="card-title"><b>{{ user.username }}</b></p><br>
			<p class="text">Name: {{ user.name + " " + user.surname }}</p>
			<p class="text">Gender: {{ user.gender }}</p>
			<p class="text">Birth date: {{ user.birth_date }}</p>
			<p class="text" v-if="user.points != undefined">Points: {{ user.points }}</p>
		</div>
	</div>
</template>

<script>

export default {
	name: 'UserCard',
	props: {
		user: {
			type: Object,
			required: true
		}
	},
	mounted() {
	},
}

</script>

<style>

.card {
	margin: 20px;
	border-radius: 10px;
	box-shadow: 2px 2px 2px lightblue;
}

</style>