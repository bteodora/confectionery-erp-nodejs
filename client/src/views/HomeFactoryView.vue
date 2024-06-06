<template>
	<HomeNavbar/>
	<DetailedFactoryView/>
</template>

<script>

import HomeNavbar from '@/components/HomeNavbar.vue';
import DetailedFactoryView from '@/views/DetailedFactoryView.vue';

export default {
	name: 'HomeDetailed',
	components: {
		HomeNavbar,
		DetailedFactoryView
	}
}

</script>