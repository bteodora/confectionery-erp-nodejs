<template>
	<AdminNavbar/>
	<DetailedFactoryView/>
</template>

<script>

import AdminNavbar from '@/components/Admin/AdminNavbar.vue';
import DetailedFactoryView from '@/views/DetailedFactoryView.vue';

export default {
	name: 'AdminFactoryView',
	components: {
		AdminNavbar,
		DetailedFactoryView
	}
}

</script>