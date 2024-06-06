<template>
	<ManagerNavbar/>
	<FactoriesView/>
</template>

<script>

import ManagerNavbar from '@/components/Manager/ManagerNavbar.vue'
import FactoriesView from '../FactoriesView.vue';

export default {
	components: {
		ManagerNavbar,
		FactoriesView
	}
}

</script>