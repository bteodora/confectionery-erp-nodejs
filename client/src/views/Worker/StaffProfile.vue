<template>

    <WorkerNavbar/>
    <div class="container" style="width: 30%;">
        <EditProfile/>
    </div>
    
    </template>
    
    <script>
    
    import WorkerNavbar from '@/components/Worker/WorkerNavbar.vue';
    import EditProfile from '@/components/EditProfile.vue';
    
    
    export default {
        name: 'WorkerProfile',
        components: {
            WorkerNavbar,
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