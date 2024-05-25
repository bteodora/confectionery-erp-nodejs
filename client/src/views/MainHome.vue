<template>
	<HomeNavbar/>
	<FactoriesView/>
</template>

<script>

import HomeNavbar from '@/components/HomeNavbar.vue'
import FactoriesView from './FactoriesView.vue';

export default {
	components: {
		HomeNavbar,
		FactoriesView
	}
}

</script>