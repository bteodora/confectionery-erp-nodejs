<template>
	<div class="containerCenter col-4">
		<h3 class="bg-secondary formHeader">Register manager</h3><br>
		<RegisterForm role="customer" endpoint="/user/register/customer" />
	</div>
</template>

<script>

import RegisterForm from '@/components/RegisterForm.vue';

export default {
	name: 'Register',
	components: {
		RegisterForm
	}
}

</script>

<style scoped></style>