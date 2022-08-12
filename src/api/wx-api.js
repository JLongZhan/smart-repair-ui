import base from '@/api/base'; // 导入接口域名列表
import axios from '@/api/axios'; // 导入http中创建的axios实例
let baseUrl = base.dev;
const WeiXinApi = {
    getSignature(params) {
        return axios.get(`${baseUrl}/maintenance/weixin/signature`,
            {
                params: params
            });
    },
    async getUserInfo(params) {
        return axios.get(`${base.dev}/maintenance/weixin/callback`,
            {
                params: params
            });
    },
    // post提交
    exit(params) {
        return axios.get("http://192.168.162.126:8000/auth-server/exit", (params));
    },
    // post提交
    callback(params) {
        return axios.get("http://192.168.162.126:8000/auth-server/callback", (params));
    }
    // 其他接口…………
}

export default WeiXinApi;
