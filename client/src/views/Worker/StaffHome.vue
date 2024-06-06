<template>
	<StaffNavbar/>
	<RouterView/>
</template>

<script>

import StaffNavbar from '@/components/Worker/WorkerNavbar.vue'
import { RouterView } from 'vue-router';

export default {
	components: {
		StaffNavbar,
		RouterView
	}
}

</script>