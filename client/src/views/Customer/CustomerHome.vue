<template>
	<CustomerNavbar/>
	<FactoriesView/>
</template>

<script>

import CustomerNavbar from '@/components/Customer/CustomerNavbar.vue'
import FactoriesView from '../FactoriesView.vue';

export default {
	components: {
		CustomerNavbar,
		FactoriesView
	}
}

</script>