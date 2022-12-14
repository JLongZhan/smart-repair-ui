import base from '@/api/base'; // 导入接口域名列表
import axios from '@/api/axios'; // 导入http中创建的axios实例

const Material = {
    getWorkPlan(params, url) {
        let u = url || base.devA;
        return axios.get(`${u}/quota/work-plan/list`,
            {
                params: params
            });
    },
    getMaterialDetail(params, url) {
        let u = url || base.devA;
        return axios.get(`${u}/quota/work-plan/material/details`,
            {
                params: params
            });
    }
}

export default Material;
