import { createRouter, createWebHistory } from 'vue-router'
import axiosInstance from '@/utils/axiosInstance'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', name: 'home', component: () => import('../views/MainHome.vue') },
		{ path: '/login', name: 'login', component: () => import('../views/LoginForm.vue') },
		{ path: '/register', name: 'register', component: () => import('../views/RegisterForm.vue'), },
		{ path: '/admin', name: 'admin', component: () => import('../views/AdminHome.vue'), meta: { requiresAuth: true, allowedRoles: ['admin'] } },
		{ path: '/customer', name: 'customer', component: () => import('../views/CustomerHome.vue'), meta: { requiresAuth: true, allowedRoles: ['customer'] } },
	]
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		axiosInstance.get('/user/profile')
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

	axiosInstance.get('/user/profile')
		.then(response => {
			next({ name: response.data.role });
		}).catch(err => {
			next();
		})
});

export default router
