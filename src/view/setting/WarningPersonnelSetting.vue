<template>
    <div>
        <!--
        right-text="保存"
        @click-right="onClickLeft"
        -->
        <van-nav-bar
                left-text="返回"
                :title="$route.meta.title"
                left-arrow
                @click-left="onClickLeft"
        />

        <!--<van-row>-->
        <!--    <van-col span="6">-->
        <!--        <el-input v-model="input" placeholder="Please input"/>-->
        <!--    </van-col>-->
        <!--</van-row>-->

        <!--{{personList}}-->

        <div style="padding:0 10px">
            <van-row gutter="10">
                <van-col span="5">
                    <div class="table-title">姓名</div>
                </van-col>
                <van-col span="5">
                    <div class="table-title">部门</div>
                </van-col>
<!--                <van-col span="5">-->
<!--                    <div class="table-title">备注</div>-->
<!--                </van-col>-->
                <van-col span="6">
                    <div class="table-title">预警类型</div>
                </van-col>
                <van-col span="5" align="center">
                    <div class="table-title">操作</div>
                </van-col>
            </van-row>
            <van-row
                    gutter="10"
                    v-for="(personItem, index) in personList" :key="index"
            >
                <van-col span="5">
                    <van-field placeholder="姓名"
                               v-model="personItem.name"/>
                </van-col>
                <van-col span="5">
                    <van-field placeholder="部门"
                               v-model="personItem.department"/>
                </van-col>
                <van-col span="5">
                    <van-field placeholder="备注"
                               v-model="personItem.remarks"/>
                </van-col>
                <van-col span="6">
                    <div style="height: 100%; width: 100%;  display: flex; align-items: center; justify-content: center">
                        <!--{{typeSelectList}}-->
                        <el-select
                                style="width: 100%" class="m-2"
                                v-model="personItem.alertTypeList" placeholder="预警类型"
                                multiple
                        >
                            <el-option
                                    v-for="(item, index) in alertAllTypeList"
                                    :key="index"
                                    :value-key="item.value"
                                    :label="item.label"
                                    :value="item"
                            />
                        </el-select>
                    </div>
                </van-col>
                <van-col span="3">
                    <div style="height: 100%; width: 100%;  display: flex; align-items: center; justify-content: center">
                        <el-tooltip
                                effect="dark"
                                content="保存"
                                placement="top-start"
                        >
                            <el-icon
                                    style="color: green" size="24px"
                                    @click="clickSave(personItem, index)"
                            >
                                <CircleCheckFilled/>
                            </el-icon>
                        </el-tooltip>
                        <el-tooltip
                                effect="dark"
                                content="删除"
                                placement="top-start"
                        >
                            <el-icon
                                    style="color: red" size="24px"
                                    @click="clickRemove(personItem, index)"
                            >
                                <RemoveFilled/>
                            </el-icon>
                        </el-tooltip>
                    </div>
                </van-col>
            </van-row>
            <van-row>
                <van-col span="24" style="padding: 10px 0">
                    <div class="flex-center-center">
                        <el-icon
                                style="color: orange" size="24px"
                                @click="clickAdd"
                        >
                            <CirclePlusFilled/>
                        </el-icon>
                    </div>
                </van-col>
            </van-row>
        </div>

        <el-dialog width="90%" v-model="dialogVisible" :show-close="false">
            <template v-slot:header>
                <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterEmployStr"
                >
                </el-input>
            </template>
            <!--内容-->
            <div style="height: 350px; padding: 0 5px; overflow: auto; box-sizing: border-box">
                <el-tree
                        :data="allEmployList"
                        show-checkbox
                        ref="tree"
                        highlight-current
                        node-key="id"
                        :filter-node-method="filterNode"
                >
                </el-tree>
            </div>
            <!--footer-->
            <div slot="footer" style="margin-top: 20px; display: flex; justify-content: flex-end; padding: 0 10px">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="clickConfirmAdd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {Toast} from "vant";
    import {RemoveFilled, CirclePlusFilled, CircleCheckFilled} from '@element-plus/icons-vue'
    import {isArrayAndHasLength, isObjectAndContainKey, isStringAndHasLength} from "../material/support_method";

    export default {
        name: "WarningPersonnelSetting",
        components: {RemoveFilled, CirclePlusFilled, CircleCheckFilled},
        data() {
            return {
                input: '',

                dialogVisible: false,
                filterEmployStr: '',
                allEmployList: [],
                personList: [], // {name: '', department: '', remarks: '', alertTypeList: [], jobNumber: '', id: ''}

                alertAllTypeList: ['不预警', '物料预警'],
            }
        },
        watch: {
            filterEmployStr(val) {
                console.log(val)
                this.$refs.tree.filter(val);
            },
        },
        methods: {
            onClickLeft() {
                history.back();
            },
            clickAdd() {
                // this.personList.push({name: '', department: '', remarks: '', alertTypeList: []})
                this.dialogVisible = true;
            },
            clickSave(personItem, index) {
                console.log(personItem);

                // 编辑修改
                let data = [];
                data.push({
                    id: personItem['id'],
                    dept: personItem['department'],
                    noticeType: this.alertTypeListToListStr(personItem['alertTypeList']),
                    remark: personItem['remarks'],
                    username: personItem['label'],
                    userno: personItem['username'],
                });
                console.log(data);

                this.$api.Setting.postAlertPersonList(data).then(response => {
                    console.log(response);
                    // if (isObjectAndContainKey(response, 'status') && response['status'] === 200) {
                    //     // console.log(response['data']);
                    //     this.handleDataGetAllEmployList(response['data']);
                    // } else if (isObjectAndContainKey(response, 'errorInfo')) {
                    //     Toast(response['errorInfo'])
                    // }

                    // 成功的话，提示ok就行了。
                    this.getPersonList()

                    // 没成功的话，这里要给一个重提示，提示网络错误，请重新保持。
                })
            },
            clickRemove(personItem, index) {
                // console.log('clickRemove');
                // this.personList.splice(index, 1);
                // console.log(personItem['id']);
                let params = {id: personItem['id']};
                // console.log(params);
                this.$api.Setting.deleteAlertPersonList(params).then(response => {
                    console.log(response);

                    this.getPersonList()
                })
            },

            clickConfirmAdd() {
                // 处理UI
                this.dialogVisible = false;

                // console.log(this.$refs.tree.getCheckedNodes().filter(item => typeof item['id'] === 'string'))
                let selectEmployList = this.$refs.tree.getCheckedNodes().filter(item => typeof item['id'] === 'string');

                // 以防添加已经存在的人

                // 上传
                let data = [];
                for (let t of selectEmployList) {
                    // console.log(t['label'], '---', t['department'])
                    data.push({
                        // add, 没有id
                        userno: t['username'], // 工号
                        username: t['label'], // 姓名
                        dept: t['department'], // 部门
                        remark: "", // 备注
                        noticeType: this.alertTypeListToListStr(['物料预警']), // 预警类型
                    })
                }
                console.log(data);

                this.$api.Setting.postAlertPersonList(data).then(response => {
                    console.log(response);
                    if (isObjectAndContainKey(response, 'code') && response['code'] === 0){
                        // console.log(response['data']);

                        this.getPersonList();
                        // 如果成功(最好是只更新这几条数据，而不是全部请求。这里需要注意的是，成功之后，其实就有id了，最好是后端把数据带上id，返回给我。)
                        // this.handleDataAddPerson(response['data']);
                    }else if (isObjectAndContainKey(response, 'message')) {
                        Toast(response['message']);
                    }
                })
            },
            // handleDataAddPerson(res){
            //     if (isArrayAndHasLength(res)){
            //         for (let t of res){
            //             // console.log(t);
            //
            //             this.personList.isContainObject(t, '')
            //             this.personList.push({
            //                 id: t['id'],
            //                 jobNumber: t['userno'],
            //                 name: t['username'],
            //                 department: t['dept'],
            //                 remarks: t['remark'],
            //                 alertTypeList: this.alertTypeListStrToList(t['noticeType']),
            //             })
            //         }
            //     }
            // },
            // 筛选上报用户方法
            filterNode(value, data) {
                // console.log(value, data);
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getAllEmployList() {
                this.$api.Setting.getAllEmployList().then(response => {
                    // console.log(response);
                    if (isObjectAndContainKey(response, 'status') && response['status'] === 200) {
                        // console.log(response['data']);
                        this.handleDataGetAllEmployList(response['data']);
                    } else if (isObjectAndContainKey(response, 'errorInfo')) {
                        Toast(response['errorInfo'])
                    }
                })
            },
            handleDataGetAllEmployList(res) {
                console.log('tree所有人：', res);

                // 处理下请求下来的“用户列表信息”
                function handleUserData(data) {
                    for (let i = 0; i < data.length; i++) {
                        let children = data[i]['children'] || [];
                        let users = data[i]['users'] || [];
                        if (users.length) {
                            if (!data[i]['children']) {
                                data[i]['children'] = [];
                            }
                            for (let j = 0; j < users.length; j++) {
                                let user = users[j];
                                user['label'] = user['realName'];
                                data[i]['children'].push(user);
                                user['department'] = data[i]['label'];
                            }
                        }
                        handleUserData(children);
                    }
                    return data;
                }

                // console.log(handleUserData(res));
                this.allEmployList = handleUserData(res);
            },
            getPersonList() {
                this.$api.Setting.getAlertPersonList().then(response => {
                    // console.log(response);
                    if (isObjectAndContainKey(response, 'code') && response['code'] === 0) {
                        // console.log(response['data']);

                        // 处理数据
                        this.handleData(response['data']);
                    } else if (isObjectAndContainKey(response, 'message')) {
                        Toast(response['message']);
                    }
                })
            },
            // 预警类型： str -> list
            alertTypeListStrToList(str) {
                if (isStringAndHasLength(str) && isStringAndHasLength(str.trim())) {
                    let tempList = str.split(',');
                    let alertTypeList = [];
                    for (let t of tempList) {
                        alertTypeList.push(t.trim())
                    }
                    return alertTypeList
                } else {
                    return []
                }
            },
            // 预警类型： list -> str
            alertTypeListToListStr(list) {
                return list.join(',')
            },
            // 处理数据
            handleData(res) {
                console.log('预警人员列表：', res);

                let personList = [];
                for (let t of res) {
                    // console.log(this.alertTypeListStrToList(t['noticeType']));

                    personList.push({
                        id: t['id'],
                        jobNumber: t['userno'],
                        name: t['username'],
                        department: t['dept'],
                        remarks: t['remark'],
                        alertTypeList: this.alertTypeListStrToList(t['noticeType']),
                    })
                }
                this.personList = personList;
                console.log('预警人员列表(处理后数据)：', this.personList)
            }
        },
        created() {
            // 获取tree人员列表
            this.getAllEmployList();

            // 获取预警人员列表
            this.getPersonList()
        }
    }
</script>

<style scoped lang="less">

    ::v-deep .van-field__body {
        border-bottom: 1px solid #666666 !important;
    }

    ::v-deep .el-dialog__body {
        padding: 0 0 10px 0;
    }

    .flex-center-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .table-title {
        padding: 10px 0 5px 0;
        font-weight: 700;
    }

</style>
