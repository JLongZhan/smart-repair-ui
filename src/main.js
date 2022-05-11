import {createApp} from 'vue';
import App from './App.vue';
import {router} from './router';
import api from './api';
import "./assets/common/init.css"
// import wx from 'work-weixin-js-sdk'
// import vConsole from 'vconsole';
//
// new vConsole();
import dateFormat from 'dateformat'

import {
    SubmitBar, Tabbar, TabbarItem, Button, DropdownMenu, DropdownItem, Notify, Toast
    , List, Card, NavBar, Divider, Tag, ConfigProvider, Empty, NoticeBar, PullRefresh
    , Form, Field, CellGroup, Calendar, DatetimePicker, Skeleton, Image as VanImage,
    Tab, Tabs, Overlay, Checkbox, CheckboxGroup
} from 'vant';

const app = createApp(App);
app.config.globalProperties.$api = api;
app.config.globalProperties.$dateFormat = dateFormat;

app.use(router);
app.use(Tabbar).use(TabbarItem).use(Button).use(SubmitBar).use(DropdownItem).use(DropdownMenu).use(Toast)
    .use(Notify).use(List).use(Card).use(NavBar).use(Divider).use(Tag).use(ConfigProvider).use(PullRefresh)
    .use(Empty).use(NoticeBar).use(Form).use(Field).use(CellGroup).use(Calendar).use(DatetimePicker)
    .use(Skeleton).use(VanImage).use(Tab).use(Tabs).use(Overlay).use(Checkbox).use(CheckboxGroup)
app.mount('#app');


