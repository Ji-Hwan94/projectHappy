<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
  <widget-container-modal />
</template>
<script>
// js 내용
// 팝업을 띄우기 위한 "jenesius-vue-modal"을 사용하기 위해
// 기본적으로 contianer라는 걸 설정해 줌
import { container } from "jenesius-vue-modal";

/* import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue"; */

// 팝업을 띄우기 위해 components에 container 설정 (decrepated)
export default {
  components: { WidgetContainerModal: container },
  name: "app",
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
