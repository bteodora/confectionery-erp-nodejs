<template>
	<WorkerNavbar/>
	<DetailedFactoryView/>
</template>

<script>

import WorkerNavbar from '@/components/Worker/WorkerNavbar.vue'
import DetailedFactoryView from '../DetailedFactoryView.vue';

export default {
	name: 'StaffFactoryView',
	components: {
		WorkerNavbar,
		DetailedFactoryView
	}
}

</script>