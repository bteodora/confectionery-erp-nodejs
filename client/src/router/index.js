import { createRouter, createWebHistory } from 'vue-router'
import axiosInstance from '@/utils/axiosInstance'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', name: 'home', component: () => import('../views/MainHome.vue') },
		{ path: '/login', name: 'login', component: () => import('../views/Login.vue') },
		{ path: '/register', name: 'register', component: () => import('../views/Register.vue'), },

		// Admin routes
		{ path: '/admin', name: 'admin', component: () => import('../views/Admin/AdminHome.vue'), meta: { requiresAuth: true, allowedRoles: ['admin'] } },
		{ path: '/admin/showallusers', name: 'admin-showallusers', component: () => import('../views/Admin/ShowAllUsers.vue'), meta: { requiresAuth: true, allowedRoles: ['admin'] } },
		{ path: '/admin/registermanager', name: 'admin-registermanager', component: () => import('../views/Admin/RegisterManager.vue'), meta: { requiresAuth: true, allowedRoles: ['admin'] } },
		{ path: '/admin/registerfactory', name: 'admin-registerfactory', component: () => import('../views/Admin/RegisterFactory.vue'), meta: { requiresAuth: true, allowedRoles: ['admin'] } },
		{ path: '/admin/profile', name: 'admin-editprofile', component: () => import('../views/Admin/AdminProfile.vue'), meta: { requiresAuth: true, allowedRoles: ['admin'] } },

		// Customer routes
		{ path: '/customer', name: 'customer', component: () => import('../views/Customer/CustomerHome.vue'), meta: { requiresAuth: true, allowedRoles: ['customer'] } },
		{ path: '/customer/profile', name: 'customer-profile', component: () => import('../views/Customer/CustomerProfile.vue'), meta: { requiresAuth: true, allowedRoles: ['customer'] } },

		// Manager routes
		{ path: '/manager', name: 'manager', component: () => import('../views/Manager/ManagerHome.vue'), meta: { requiresAuth: true, allowedRoles: ['manager'] } },
		{ path: '/manager/addchocolate', name: 'manager-addChocolate', component: () => import('../views/Manager/AddChocolate.vue'), meta: { requiresAuth: true, allowedRoles: ['manager'] } },
		{ path: '/manager/allchocolate', name: 'manager-allChocolate', component: () => import('../views/Manager/AllChocolates.vue'), meta: { requiresAuth: true, allowedRoles: ['manager'] } },
		{ path: '/manager/registerstaff', name: 'manager-registerstaff', component: () => import('../views/Manager/RegisterStaff.vue'), meta: { requiresAuth: true, allowedRoles: ['manager'] } },
		{ path: '/manager/profile', name: 'manager-profile', component: () => import('../views/Manager/ManagerProfile.vue'), meta: { requiresAuth: true, allowedRoles: ['manager'] } },
		
		// Staff routes
		{ path: '/staff', name: 'staff', component: () => import('../views/Worker/StaffHome.vue'), meta: { requiresAuth: true, allowedRoles: ['staff'] } },
		{ path: '/staff/chocolates', name: 'staffchocolates', component: () => import('../views/Worker/StaffChocolates.vue'), meta: { requiresAuth: true, allowedRoles: ['staff'] } },
		{ path: '/staff/profile', name: 'staffprofile', component: () => import('../views/Worker/StaffProfile.vue'), meta: { requiresAuth: true, allowedRoles: ['staff'] } },
	]
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		axiosInstance.get('/user/verify')
			.then(response => {
				if (to.matched.some(record => record.meta.allowedRoles.includes(response.data.role))) {
					next();
				} else {
					next({ name: response.data.role });
				}
			}).catch(err => {
				next({ name: 'home' });
			})
	}
	else {
		axiosInstance.get('/user/verify')
		.then(response => {
			next({ name: response.data.role });
		}).catch(err => {
			next();
		})
	}
});

export default router
