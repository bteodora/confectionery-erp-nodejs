<template>
	<ManagerNavbar/>
	<RouterView/>
</template>

<script>

import ManagerNavbar from '@/components/Manager/ManagerNavbar.vue'
import { RouterView } from 'vue-router';

export default {
	components: {
		ManagerNavbar,
		RouterView
	}
}

</script>