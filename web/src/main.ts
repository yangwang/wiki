import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as Icons from '@ant-design/icons-vue';
import axios from 'axios';
import {Tool} from "@/util/tool";
import { message } from 'ant-design-vue';

axios.defaults.baseURL = process.env.VUE_APP_SERVER;

/**
 * axios������
 */
axios.interceptors.request.use(function (config) {
  console.log('���������', config);
  const token = store.state.user.token;
  if (Tool.isNotEmpty(token)) {
    config.headers.token = token;
    console.log("����headers����token:", token);
  }
  return config;
}, error => {
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
  console.log('���ؽ����', response);
  return response;
}, error => {
  console.log('���ش���', error);
  const response = error.response;
  const status = response.status;
  if (status === 401) {
    // �ж�״̬����401 ��ת����ҳ���¼ҳ
    console.log("δ��¼��������ҳ");
    store.commit("setUser", {});
    message.error("δ��¼���¼��ʱ");
    router.push('/');
  }
  return Promise.reject(error);
});

const app = createApp(App);
app.use(store).use(router).use(Antd).mount('#app');

// ȫ��ʹ��ͼ��
const icons: any = Icons;
for (const i in icons) {
  app.component(i, icons[i]);
}

console.log('������', process.env.NODE_ENV);
console.log('����ˣ�', process.env.VUE_APP_SERVER);
