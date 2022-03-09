/**
 * api接口的统一出口
 */
import Exception from '@/view/exception/Exception';
import WeiXinApi from '@/api/wx-api';
// 其他模块的接口……

// 导出接口
export default {
    Exception: Exception,
    WeiXinApi: WeiXinApi
}
