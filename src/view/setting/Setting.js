import base from '@/api/base'; // 导入接口域名列表
import axios from '@/api/axios'; // 导入http中创建的axios实例

const Setting = {
    getAllEmployList(params, url) {
        let u = url || base.devA;
        return axios.get(`${u}/eums/organizations/users`,
            {
                params: params
            });
    },
    // get预警人员列表
    getAlertPersonList(params, url) {
        let u = url || base.dev;
        return axios.get(`${u}/user/notice`,
            {
                params: params
            });
    },
    // delete预警人员列表
    deleteAlertPersonList(params, url) {
        let u = url || base.dev;
        return axios.delete(`${u}/user/notice`,
            {
                params: params
            });
    },
    // post预警人员
    postAlertPersonList(data, url){
        let u = url || base.dev;
        return axios.post(`${u}/user/notice`, data);
    }
}

export default Setting;
