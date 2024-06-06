<template>
	<CustomerNavbar/>
	<DetailFactoryView/>
</template>

<script>

import CustomerNavbar from '@/components/Customer/CustomerNavbar.vue';
import DetailFactoryView from '../DetailedFactoryView.vue';

export default {
	name: 'CustomerFactoryView',
	components: {
		CustomerNavbar,
		DetailFactoryView
	}
}

</script>