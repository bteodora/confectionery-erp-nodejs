<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand">
                <img src="../../assets/img/chocolate.png" alt="" width="30" height="24" class="d-inline-block align-text-top">
                Choco factory
            </a>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownChocolates" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Factories
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownChocolates">
                        <li><router-link class="dropdown-item" to="/manager">Show All</router-link></li>
                        <li><a class="dropdown-item" @click="myfactory">My factory</a></li>
                    </ul>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownChocolates" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Chocolates
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownChocolates">
                        <li><router-link class="dropdown-item" to="/manager/allchocolate">Show All</router-link></li>
                        <li><router-link class="dropdown-item" to="/manager/addchocolate">Add new</router-link></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/manager/registerstaff">Register Worker</router-link>
                </li>
                <li class="nav-item dropdown">
                    <router-link class="nav-link" to="/manager/purchases">Purchases</router-link>
                </li>
            </ul>

            <a class="navbar-brand">{{ username }}</a>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Menu
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><router-link class="dropdown-item" to="/manager/profile">Edit profile</router-link></li>
                    <li><button class="dropdown-item" v-on:click="logout()">Logout</button></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import axiosInstance, { logoutUser, getUserProfile } from '@/utils/axiosInstance';

export default {
    name: 'ManagerNavbar',
    data() {
        return {
            username: '',
            role: '',
            factoryId: null
        };
    },
    mounted() {
        const profile = getUserProfile();
		this.username = profile.username;
        axiosInstance.get('/user/factoryid')
        .then((response) => {     
            this.factoryId = response.data.factoryId;
        })
        .catch((error) => {
			alert(error);
            console.error('Error fetching factoryId:', error);
        });
    },
    methods: {
        logout() {
            logoutUser();
            this.$router.push('/');
        },
        myfactory() {
        const viewingRole = getUserProfile().role;
        let route = {query: {factoryId: this.factoryId}};

        if(viewingRole == 'admin')
            route.path = '/admin/factorydetails';
        else if(viewingRole == 'manager')
            route.path = '/manager/factorydetails';
        else if(viewingRole == 'customer')
            route.path = '/customer/factorydetails';
        else if(viewingRole == 'staff')
            route.path = '/staff/factorydetails';
        else
            route.path = '/factorydetails';

        this.$router.push(route);
        }
    }
};
</script>

<style scoped></style>
