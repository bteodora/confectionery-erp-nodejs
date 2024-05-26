<template>
	<AdminNavbar />
	<div class="containerCenter col-4">
		<h3 class="bg-secondary formHeader">Register manager</h3><br>
		<RegisterForm role="manager" endpoint="/user/register/manager" />
	</div>
</template>

<script>

import RegisterForm from '@/components/RegisterForm.vue';
import AdminNavbar from '@/components/Admin/AdminNavbar.vue';

export default {
	name: 'RegisterManager',
	components: {
		RegisterForm,
		AdminNavbar
	}
}

</script>

<style scoped></style>