<template>
	<AdminNavbar/>
	<FactoriesView/>
</template>

<script>

import AdminNavbar from '@/components/Admin/AdminNavbar.vue'
import FactoriesView from '../FactoriesView.vue';

export default {
	components: {
		AdminNavbar,
		FactoriesView
	}
}

</script>