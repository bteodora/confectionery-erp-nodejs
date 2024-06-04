<template>

    <CustomerNavbar/>
    <div class="container" style="width: 30%;">
        <EditProfile/>
    </div>
    
    </template>
    
    <script>
    
    import CustomerNavbar from '@/components/Customer/CustomerNavbar.vue';
    import EditProfile from '@/components/EditProfile.vue';
    
    
    export default {
        name: 'CustomerProfile',
        components: {
            CustomerNavbar,
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