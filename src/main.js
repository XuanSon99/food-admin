import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import axios from 'axios'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

Vue.config.productionTip = false

Vue.prototype.image = function (url) {
  return "http://localhost:8000/" + url;
},

Vue.prototype.$urlAPI = 'http://127.0.0.1:8000/api/'

Vue.prototype.$config = {
  headers: {
    "Authorization": "Bearer " + localStorage.getItem("token"),
  },
};

Vue.prototype.CallAPI = function (method, url, data, callResponse, callError) {
  switch (method) {
    case "post":
      axios.post(this.$urlAPI + url, data, this.$config).then((response) => {
        if (response.data.statusCode === 401) {
          sessionStorage.clear();
          location.reload();
        }
        callResponse(response)
      })
        .catch((error) => {
          callError(error)
        })
      break;
    case "get":
      axios.get(this.$urlAPI + url, this.$config)
        .then((response) => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear();
            location.reload();
          }
          callResponse(response)
        })
        .catch((error) => {
          callError(error)
        })
      break;
    case "put":
      axios.put(this.$urlAPI + url, data, this.$config)
        .then((response) => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear();
            location.reload();
          }
          callResponse(response)
        })
        .catch((error) => {
          callError(error)
        })
      break;
    case "delete":
      axios.delete(this.$urlAPI + url, this.$config)
        .then((response) => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear();
            location.reload();
          }
          callResponse(response)
        })
        .catch((error) => {
          callError(error)
        })
      break;
  }
}

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
