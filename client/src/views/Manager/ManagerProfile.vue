<template>

<ManagerNavbar/>
<div class="container" style="width: 30%;">
	<EditProfile/>
</div>

</template>

<script>

import ManagerNavbar from '@/components/Manager/ManagerNavbar.vue';
import EditProfile from '@/components/EditProfile.vue';


export default {
	name: 'ManagerProfile',
	components: {
		ManagerNavbar,
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