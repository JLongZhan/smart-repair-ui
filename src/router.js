import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        name: 'notFound',
        path: '/:path(.*)+',
        redirect: {
            name: 'Exception',
        },
    },
    {
        name: 'Exception',
        path: '/exception',
        component: () => import('./view/exception'),

        children: [
            {
                name: 'ExceptionDetails',
                path: 'details',
                component: () => import('./view/exception/exception-details'),
                meta: {
                    title: '通知详情',
                    index: 1,
                    showFooter: false
                },
                children: [
                    {
                        name: 'ExceptionComplete',
                        path: 'complete',
                        component: () => import('./view/exception/process-complete'),
                        meta: {
                            title: '处理完成',
                            index: 2,
                            showFooter: false
                        }
                    },
                ]
            }
        ],
        meta: {
            title: '通知列表',
            index: 0,
            showFooter: true
        }
    },
    {
        name: 'menu',
        path: '/menu',
        component: () => import('./view/menu'),
        meta: {
            title: '菜单',
            index: 0,
            showFooter: true
        },
        children: [
            {
                name: 'material',
                path: 'material',
                component: () => import('./view/material'),
                meta: {
                    title: '物料预警',
                    index: 1,
                    showFooter: false
                },
                children: [
                    {
                        name: 'MaterialDetail',
                        path: 'detail',
                        component: () => import('./view/material/MaterialDetail'),
                        meta: {
                            title: '物料详情',
                            index: 2,
                            showFooter: false
                        },
                    },
                ]
            },

        ]
    },
    {
        name: 'mine',
        path: '/mine',
        component: () => import('./view/mine'),
        meta: {
            title: '我的',
            index: 0,
            showFooter: true
        },
    },
    {
        name: 'setting',
        path: '/setting',
        component: () => import('./view/setting'),
        meta: {
            title: '我的',
            index: 0,
            showFooter: true
        },
        children: [
            {
                name: 'warningpersonnelsetting',
                path: 'warningpersonnelsetting',
                component: () => import('./view/setting/WarningPersonnelSetting'),
                meta: {
                    title: '预警人员设置',
                    index: 1,
                    showFooter: false
                },
            }
        ]
    },
    {
        name: 'publish',
        path: '/publish',
        component: () => import('./view/publish'),
        meta: {
            title: '异常推送',
            index: 1,
            showFooter: false
        },
    },
    {
        name: 'qr',
        path: '/qrlogin',
        component: () => import('./view/qrcode'),
        meta: {
            title: '企业微信登录',
        },
    }

];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    next();
});
router.afterEach(() => {

})

// {
//     // 当 /user/:id/profile 匹配成功，
//     // UserProfile 会被渲染在 User 的 <router-view> 中
//     name: 'ExceptionDetails',
//     path: '/exception/details',
//     component: () => import('./view/exception/exception-details'),
//     meta: {
//         title: '异常详情',
//         index: 1,
//         showFooter: false
//     }
// }
// ,

export {router};
