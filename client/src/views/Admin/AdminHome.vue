<template>
	<AdminNavbar/>
	<RouterView/>
</template>

<script>

import AdminNavbar from '@/components/Admin/AdminNavbar.vue';
import { RouterView } from 'vue-router';

export default {
	name: 'AdminHome',
	components: {
		AdminNavbar,
		RouterView
	}
}

</script>