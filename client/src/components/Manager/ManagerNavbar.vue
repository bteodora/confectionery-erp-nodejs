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
                        <li><router-link class="dropdown-item" >Show ratings</router-link></li>
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
                    <router-link class="nav-link" to="/manager/registerstaff">Workers</router-link>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownPurchases" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Purchases
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownPurchases">
                        <li><router-link class="dropdown-item" >Pending</router-link></li>
                        <li><router-link class="dropdown-item" >Past</router-link></li>
                    </ul>
                </li>
            </ul>

            <a class="navbar-brand">{{ username }}</a>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Menu
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><router-link class="dropdown-item">Edit profile</router-link></li>
                    <li><button class="dropdown-item" v-on:click="logout()">Logout</button></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import axiosInstance, { logoutUser } from '@/utils/axiosInstance';

export default {
    name: 'ManagerNavbar',
    data() {
        return {
            username: '',
            role: ''
        };
    },
    mounted() {
        axiosInstance.get('/user/profile')
            .then((response) => {
                this.username = response.data.username;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    methods: {
        logout() {
            logoutUser();
            this.$router.push('/');
        }
    }
};
</script>

<style scoped></style>
