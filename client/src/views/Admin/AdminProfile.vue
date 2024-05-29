<template>

<AdminNavbar/>
<div class="container" style="width: 30%;">
	<EditProfile/>
</div>

</template>

<script>

import AdminNavbar from '@/components/Admin/AdminNavbar.vue';
import EditProfile from '@/components/EditProfile.vue';


export default {
	name: 'AdminProfile',
	components: {
		AdminNavbar,
		EditProfile
	}
}

</script>

<style scoped>

.container {
	margin-top: 50px;
	margin-bottom: 100px;
	margin-left: auto;
	margin-right: auto;
}

</style>