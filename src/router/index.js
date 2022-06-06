import { createRouter, createWebHistory } from 'vue-router'
import firebase from "firebase";
import Home from "@/views/Home";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Lines from "@/views/Lines";
import Schedule from "@/views/Schedule";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      loggedOut: true,
      requiresAuth: true
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      loggedOut: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      loggedOut: true,
    },
  },
  
  
  {
    path: "/lines",
    name: "Lines",
    component: Lines
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: Schedule
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const loggedOut = to.matched.some((record) => record.meta.loggedOut);
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user && requiresAuth) {
      next("/login");
    } else if (loggedOut && user)  {
      next("/lines");
    } else {
      next();
    }
  });
});

export default router;
