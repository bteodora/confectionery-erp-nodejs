<template>
	<RegisterForm :title="'Register as customer'" :role="customer" :endpoint="'/user/register/customer'"/>
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

<style scoped>

</style>