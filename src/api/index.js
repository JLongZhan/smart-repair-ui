/**
 * api接口的统一出口
 */
import Exception from '@/view/exception/Exception';
import Material from '@/view/material/Material';
import WeiXinApi from '@/api/wx-api';
import Setting from "@/view/setting/Setting";
// 其他模块的接口……

// 导出接口
export default {
    Exception: Exception,
    WeiXinApi: WeiXinApi,
    Material: Material,
    Setting: Setting
}
