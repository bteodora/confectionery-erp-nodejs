<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
			<a class="navbar-brand">
				<img src="../assets/img/chocolate.png" alt="" width="30" height="24" class="d-inline-block align-text-top">
      			Choco factory
			</a>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" aria-current="page" to="/">Factories</router-link>
                    </li>
                </ul>
            </div>

            <div class="btn-group">
                <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Menu
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><router-link to="/login" class="dropdown-item" type="button">Login</router-link></li>
                    <li><router-link to="/register" class="dropdown-item" type="button">Register</router-link></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>

export default {
    name: 'HomeNavbar'
}

</script>