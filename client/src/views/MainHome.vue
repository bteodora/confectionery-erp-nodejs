<template>
	<HomeNavbar/>
	<RouterView/>
</template>

<script>

import HomeNavbar from '@/components/HomeNavbar.vue'
import { RouterView } from 'vue-router';

export default {
	components: {
		HomeNavbar,
		RouterView
	}
}

</script>