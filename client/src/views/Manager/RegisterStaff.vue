<template>
    <ManagerNavbar/>
    <div class="containerCenter col-4">
		<h3 class="bg-secondary formHeader">Register staff member</h3><br>
		<RegisterForm role="staff" endpoint="/user/register/staff"/>
	</div>
</template>

<script>
    import RegisterForm from '@/components/RegisterForm.vue';
    import ManagerNavbar from '@/components/Manager/ManagerNavbar.vue';

    export default {
	name: 'RegisterStaff',
	components: {
		RegisterForm,
		ManagerNavbar
	}
}
</script>