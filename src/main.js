import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './reset.css'
import './style.css'

import App from './App.vue'
import router from "./util/router/router"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

const app = createApp(App)
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.mount('#app')
