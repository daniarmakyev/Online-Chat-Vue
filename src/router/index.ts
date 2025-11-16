import {
	createRouter,
	createWebHistory,
	type RouteLocationNormalized,
	type NavigationGuardNext,
} from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const routes = [
	{
		path: "/",
		redirect: "/channels",
	},
	{
		path: "/auth",
		name: "Auth",
		component: () => import("../views/AuthView.vue"),
		meta: { requiresGuest: true },
	},
	{
		path: "/channels",
		name: "Channels",
		component: () => import("../views/ChannelsView.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/chat/:channelId",
		name: "Chat",
		component: () => import("../views/ChatView.vue"),
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(
	(
		to: RouteLocationNormalized,
		_: RouteLocationNormalized,
		next: NavigationGuardNext,
	) => {
		const authStore = useAuthStore();

		if (to.meta.requiresAuth && !authStore.isAuthenticated) {
			next("/auth");
		} else if (to.meta.requiresGuest && authStore.isAuthenticated) {
			next("/channels");
		} else {
			next();
		}
	},
);

export default router;
