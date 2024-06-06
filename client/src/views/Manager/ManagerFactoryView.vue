<template>
	<ManagerNavbar/>
	<DetailedFactoryView/>
</template>

<script>

import ManagerNavbar from '@/components/Manager/ManagerNavbar.vue'
import DetailedFactoryView from '../DetailedFactoryView.vue';

export default {
	name: 'ManagerFactoryView',
	components: {
		ManagerNavbar,
		DetailedFactoryView
	}
}

</script>