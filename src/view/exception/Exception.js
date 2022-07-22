/**
 * article模块接口列表
 */

import base from '@/api/base'; // 导入接口域名列表
import axios from '@/api/axios'; // 导入http中创建的axios实例

const Exception = {
    getSignature(params) {
        return axios.get(`${base.dev}/maintenance/weixin/signature`,
            {
                params: params
            });
    },
    exceptionList(params) {
        return axios.get(`${base.dev}/maintenance/exception/list`,
            {
                params: params
            });
    },
    getExceptionTags(params) {
        return axios.get(`${base.dev}/maintenance/dict/list`,
            {
                params: params
            });
    },
    exceptionDetail(exceptionId) {
        return axios.get(`${base.dev}/maintenance/exception/${exceptionId}`, {});
    },
    exceptionPush(params) {
        return axios.post(`${base.dev}/maintenance/exception/create`, params, {});
    },
    exceptionProcess(params) {
        return axios.post(`${base.dev}/maintenance/exception-process`, params, {});
    },
    exceptionProcessComplete(params) {
        return axios.post(`${base.dev}/maintenance/exception-process/complete`, params, {});
    },

    uploadImage(data, param) {
        return axios.post(`${base.dev}/maintenance/imgs/uploadimg`, data, {
            params: param,
            headers: {'Content-Type': 'multipart/form-data;charset=utf-8'},
        });
    },
    // // post提交
    // login(params) {
    //     return axios.post(`${base.sq}/accesstoken`, qs.stringify(params));
    // }
    // 其他接口…………
}

export default Exception;
