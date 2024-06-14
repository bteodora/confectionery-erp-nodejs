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
		</div>
	</div>

</template>

<script>

export default {
	name: 'CommentCard',
	props: {
		comment: {
			type: Object,
			required: true
		}
	},
	methods: {
		formatDate(dateString) {
			let date = new Date(dateString);
			let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
			let timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
			let formattedDate = date.toLocaleDateString(undefined, dateOptions);
			let formattedTime = date.toLocaleTimeString(undefined, timeOptions);
			return `${formattedDate} ${formattedTime}`;
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
</style>