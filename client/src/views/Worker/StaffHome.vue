<template>
	<StaffNavbar/>
	<FactoriesView/>
</template>

<script>

import StaffNavbar from '@/components/Worker/WorkerNavbar.vue'
import FactoriesView from '../FactoriesView.vue';

export default {
	components: {
		StaffNavbar,
		FactoriesView
	}
}

</script>