/**
 * article模块接口列表
 */

import base from '@/api/base'; // 导入接口域名列表
import axios from '@/api/axios'; // 导入http中创建的axios实例

const Exception = {
    getSignature(params) {
        return axios.get(`${base.dev}/weixin/signature`,
            {
                params: params
            });
    },
    exceptionList(params) {
        return axios.get(`${base.dev}/exception/list`,
            {
                params: params
            });
    },
    groupList(params) {
        return axios.get(`${base.dev}/appchat/list`,
            {
                params: params
            });
    },
    exceptionDetail(exceptionId) {
        return axios.get(`${base.dev}/exception/${exceptionId}`, {});
    },
    exceptionPush(params) {
        return axios.post(`${base.dev}/exception/create`, params, {});
    },
    exceptionProcess(params) {
        return axios.post(`${base.dev}/exception-process`, params, {});
    },
    exceptionProcessComplete(params) {
        return axios.post(`${base.dev}/exception-process/complete`, params, {});
    },
    // // post提交
    // login(params) {
    //     return axios.post(`${base.sq}/accesstoken`, qs.stringify(params));
    // }
    // 其他接口…………
}

export default Exception;