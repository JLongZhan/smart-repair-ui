import base from '@/api/base'; // 导入接口域名列表
import axios from '@/api/axios'; // 导入http中创建的axios实例
let baseUrl = base.dev;
const WeiXinApi = {
    getSignature(params) {
        return axios.get(`${baseUrl}/weixin/signature`,
            {
                params: params
            });
    },
    async getUserInfo(params) {
        return axios.get(`${base.dev}/weixin/callback`,
            {
                params: params
            });
    }
    // // post提交
    // login(params) {
    //     return axios.post(`${base.sq}/accesstoken`, qs.stringify(params));
    // }
    // 其他接口…………
}

export default WeiXinApi;