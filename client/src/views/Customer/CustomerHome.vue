<template>
	<CustomerNavbar />
	<RouterView />
</template>

<script>

import CustomerNavbar from '@/components/Customer/CustomerNavbar.vue'
import { RouterView } from 'vue-router';

export default {
	components: {
		CustomerNavbar,
		RouterView
	}
}

</script>