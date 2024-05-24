<template>
	<AdminNavbar/>
	<RegisterForm role="manager" title="Register manager" endpoint="/user/register/manager"/>
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

<style scoped>

</style>