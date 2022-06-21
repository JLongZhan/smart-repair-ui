<template>
    <div>
        <div class="MaterialDetail" v-show="$route.meta.index===2">
            <van-nav-bar
                    left-text="返回"
                    :title="getTitle()"
                    left-arrow
                    @click-left="onClickLeft"

            />
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    @row-click="rowClick"
                    ref="elTable"
                    row-key="materialNo"
            >
                <el-table-column type="index" min-width="30"/>
                <el-table-column label="物料号" min-width="90" prop="materialNo"/>
                <!--<el-table-column label="线边仓量" prop="localStock" />-->
                <el-table-column label="线边仓量">
                    <template #default="props">
                        {{getLocalStock(props.row)}}
                    </template>
                </el-table-column>
                <el-table-column label="实际库存量">
                    <template #default="props">
                        <!--<span :class="[props['row']['stock'] < 0?'small-zero':'big-zero']">-->
                        <span >
                            {{getStock(props.row)}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="待IQC量">
                    <template #default="props">
                        <span>
                            {{getIqc(props.row)}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template #default="props">
                        <div class="table-expand-cell">
                            <div class="table-expand-cell-line">工单：{{props['row']['workNo']}}</div>
                            <div class="table-expand-cell-line">物料：{{props['row']['materialNo']}}</div>
                            <!--<div class="table-expand-cell-line">规格：无数据</div>-->
                            <div class="table-expand-cell-line">单位产品标准用料数量：
                                <span v-if="this.subArea !== '其他'">
                                    {{getMaterial(props['row'])}} pcs
                                </span>
                                <span v-else>
                                    /
                                </span>
                            </div>
                            <div class="table-expand-cell-line">工单剩余产品耗用物料数量：
                                <span v-if="this.subArea !== '其他'">
                                    {{getDayOver(props['row'])}}
                                </span>
                                <span v-else>
                                    /
                                </span>
                            </div>
                            <div class="table-expand-cell-line">
                                实际库存物料数量：
                                <!--<span :class="[props['row']['stock'] < 0?'small-zero':'big-zero']">-->
                                <span>
                                    {{getStock(props.row)}}
                                </span>
                            </div>
                            <div class="table-expand-cell-line">待IQC物料数量：{{props['row']['iqc'] ===
                                null?'无数据':props['row']['iqc']}}
                            </div>
                            <div class="table-expand-cell-line">线边仓物料数量：{{props['row']['localStock'] === null ||
                                props['row']['localStock'] === 'NaN'?'无数据':props['row']['localStock']}}
                            </div>
                            <div class="table-expand-cell-line" v-if="subArea !== '其他'">
                                <div style="color: blue">
                                    备注：<span>其他工单占用此物料数量：</span>
                                    <div v-show="getOther(props.row).length === 0">
                                        无数据
                                    </div>
                                    <div class="abc" v-show="getOther(props.row).length > 0" style="padding: 10px 0; ">
                                        <!--=======================-->
                                        <!--<ul style="list-style-position: inside;">-->
                                        <!--    <li style="list-style-type: disc" v-for="(item, index) in getOther(props.row)" :key="index">-->
                                        <!--        {{`${item['worksheet']}(${item['number']})`}}-->
                                        <!--    </li>-->
                                        <!--</ul>-->

                                        <!--=======================-->
                                        <el-table style="width: 400px;" :data="getOther(props.row)" :row-class-name="tableRowClassName2">
                                            <!--<el-table-column type="index" min-width="30">-->
                                            <!--    -->
                                            <!--</el-table-column>-->
                                            <!--<el-table-column width="50">-->
                                            <!--    <template v-slot:default="scope">-->
                                            <!--        <div style="color: blue">-->
                                            <!--            {{scope.row['index']}}-->
                                            <!--        </div>-->
                                            <!--    </template>-->
                                            <!--</el-table-column>-->
                                            <el-table-column >
                                                <template #header>
                                                    <div style="color: blue;">
                                                        工单
                                                    </div>
                                                </template>
                                                <template v-slot:default="scope">
                                                    <div style="color: blue">
                                                        {{scope.row['worksheet']}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column>
                                                <template #header>
                                                    <div style="color: blue">
                                                        数量
                                                    </div>
                                                </template>
                                                <template v-slot:default="scope">
                                                    <div style="color: blue">
                                                        {{scope.row['number']}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {
        isArrayAndHasLength,
        isObjectAndContainKey,
        isObjectAndHasKeys,
        isObjectAndNotHasKeys
    } from "./support_method";
    import {Toast} from "vant";

    export default {
        name: "MaterialDetail",
        data() {
            return {
                workNo: null,
                materialCode: null,
                subArea: null,
                tableData: [],

                timeoutID: null, // 定时器
            }
        },
        methods: {
            getTitle(){
                return `${this.workNo} - ${this.subArea}`
            },
            rowClick(row, column, event) {
                row.expand = !row.expand;
                this.$refs['elTable'].toggleRowExpansion(row, row.expand);
            },
            getDayOver(row) {
                if (row['dayOver'] === null || row['dayOver'] === 'NaN') {
                    return '无数据'
                } else {
                    return row['dayOver']
                }
            },
            getMaterial(row) {
                if (row['materialUnit'] === null || row['materialUnit'] === 'NaN') {
                    return '无数据'
                } else {
                    return row['materialUnit']
                }
            },
            getLocalStock(row) {
                if (row['localStock'] === null || row['localStock'] === 'NaN') {
                    return '无数据'
                } else {
                    return row['localStock']
                }
            },
            getOther(row){
                // console.log(row['otherGet']);
                // {61SF01-2205000193: 2000, 61SF01-2205000229: 4000}
                if (row['otherGet'] === null || isObjectAndNotHasKeys(row['otherGet'])){
                    return []
                }else if(isObjectAndHasKeys(row['otherGet'])){
                    let resultList = [];
                    for (let key in row['otherGet']){
                        // console.log(key)
                        // resultList.push(`${key}(${row['otherGet'][key]})`)
                        resultList.push({
                            worksheet: key,
                            number: row['otherGet'][key]
                        })
                    }
                    // console.log(resultList);

                    for (let i = 0; i < resultList.length; i++) {
                        resultList[i]['index'] = i + 1
                    }

                    return resultList;
                    // return resultList.join(', ')
                }
            },
            getStock(row) {
                // console.log(row['stock'])
                // console.log(typeof row['stock'])

                // if (row['stock'] === null) {
                //     return '无数据'
                // } else if (row['stock'] < 0) {
                //     // return 0 +'(欠' + Math.abs(row['stock']) +
                //     return `0(欠${Math.abs(row['stock'])})`
                // } else {
                //     return Math.abs(row['stock'])
                // }

                if (row['realStock'] === null){
                    return '无数据'
                }else {
                    return row['realStock']
                }
            },
            getIqc(row) {
                if (row['iqc'] === null || row['localStock'] === 'NaN') {
                    if (row['stock'] === null || row['stock'] === 'NaN') {
                        return '无数据'
                    } else {
                        return 0
                    }
                } else {
                    return row['iqc']
                }
            },
            onClickLeft() {
                history.back();
            },
            tableRowClassName2(){
                return 'remark-row';
            },
            // 给颜色
            tableRowClassName({row, rowIndex}) {
                // console.log(row.dayOver > row.stock)

                // if (row.dayOver > row.stock || row.stock === null) {
                //     return 'warning-row';
                // }
                // else if (rowIndex === 3) {
                //     return 'success-row';
                // }

                if (row.stock === null || row.stock < 0) {
                    return 'warning-row';
                }

                // // 实际库存
                // let realStock = 0;
                // if (this.getStock(row) !== '无数据'){
                //     realStock = this.getStock(row)
                // }
                // console.log(realStock);
                //
                // // 其他工单需要使用：
                // let otherNeedNumber = 0;
                // let getOtherList = this.getOther(row);
                // if (isArrayAndHasLength(getOtherList)){
                //     for (let t of getOtherList){
                //         // console.log(t['number'])
                //         otherNeedNumber += t['number'] || 0
                //     }
                // }
                // // console.log('----', otherNeedNumber);
                //
                // // 剩余产品需要耗材
                // let dayOver = 0;
                // if (row['dayOver'] !== null){
                //     dayOver = row['dayOver']
                // }
                // console.log(dayOver);
                //
                //
                // if (realStock - otherNeedNumber - dayOver < 0) {
                //     return 'warning-row';
                // }


                return '';
            },
            getMaterialDetailList() {
                let params = {};
                params = {
                    workNo: this.workNo || '',
                    materialCode: this.materialCode || '',
                    subArea: this.subArea
                };
                this.$api.Material.getMaterialDetail(params)
                    .then(res => {
                        // console.log(res);

                        // Toast提示
                        if (isObjectAndContainKey(res, 'message')) {
                            Toast(res['message']);
                        }

                        this.handleDate(res)
                    })
                    .catch(err => {
                        console.log(err);
                    })


                // let res = [{"workNo":"61SF01-2205000062","materialNo":"45701365","materialUnit":6.0,"stock":0,"iqc":0,"dayOver":4602,"localStock":1698.0},{"workNo":"61SF01-2205000062","materialNo":"32201859","materialUnit":1.0,"stock":18094,"iqc":0,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"47406027","materialUnit":1.0,"stock":null,"iqc":null,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"42001294","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"31602464","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"45300655","materialUnit":2.0,"stock":0,"iqc":0,"dayOver":1150,"localStock":182.0},{"workNo":"61SF01-2205000062","materialNo":"45700197","materialUnit":2.0,"stock":0,"iqc":0,"dayOver":1150,"localStock":182.0},{"workNo":"61SF01-2205000062","materialNo":"32201560","materialUnit":1.0,"stock":null,"iqc":null,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"32201559","materialUnit":1.0,"stock":null,"iqc":null,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"45300077","materialUnit":8.0,"stock":0,"iqc":0,"dayOver":19576,"localStock":15704.0},{"workNo":"61SF01-2205000062","materialNo":"81200709","materialUnit":4.0,"stock":0,"iqc":0,"dayOver":2300,"localStock":364.0},{"workNo":"61SF01-2205000062","materialNo":"45300111","materialUnit":16.0,"stock":0,"iqc":0,"dayOver":16112,"localStock":8368.0},{"workNo":"61SF01-2205000062","materialNo":"45901678","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"81200720","materialUnit":2.0,"stock":0,"iqc":0,"dayOver":1150,"localStock":182.0},{"workNo":"61SF01-2205000062","materialNo":"45300127","materialUnit":17.0,"stock":0,"iqc":0,"dayOver":16687,"localStock":8459.0},{"workNo":"61SF01-2205000062","materialNo":"49200055","materialUnit":0.17,"stock":50819,"iqc":0,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"45700267","materialUnit":3.0,"stock":0,"iqc":0,"dayOver":12669,"localStock":11217.0},{"workNo":"61SF01-2205000062","materialNo":"49500005","materialUnit":4.0,"stock":0,"iqc":0,"dayOver":2300,"localStock":364.0},{"workNo":"61SF01-2205000062","materialNo":"45701576","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"45701526","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"45701406","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"42001266","materialUnit":1.0,"stock":0,"iqc":1500,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"42001262","materialUnit":2.0,"stock":0,"iqc":0,"dayOver":1150,"localStock":182.0},{"workNo":"61SF01-2205000062","materialNo":"45300205","materialUnit":4.0,"stock":0,"iqc":0,"dayOver":3452,"localStock":1516.0},{"workNo":"61SF01-2205000062","materialNo":"45700316","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":5183,"localStock":4699.0},{"workNo":"61SF01-2205000062","materialNo":"45701481","materialUnit":1.0,"stock":417,"iqc":0,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"45701515","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"45701482","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"45701679","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"45700132","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"42001265","materialUnit":1.0,"stock":0,"iqc":1600,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"31602470","materialUnit":1.0,"stock":-576,"iqc":0,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"31104260","materialUnit":1.0,"stock":null,"iqc":null,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"45400298","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"42300009","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"42001295","materialUnit":1.0,"stock":959,"iqc":0,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"31602471","materialUnit":1.0,"stock":-556,"iqc":0,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"45701434","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":575,"localStock":91.0},{"workNo":"61SF01-2205000062","materialNo":"45701534","materialUnit":1.0,"stock":0,"iqc":0,"dayOver":2303,"localStock":1819.0},{"workNo":"61SF01-2205000062","materialNo":"31104248","materialUnit":1.0,"stock":null,"iqc":null,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"31104262","materialUnit":2.0,"stock":null,"iqc":null,"dayOver":null,"localStock":null},{"workNo":"61SF01-2205000062","materialNo":"31301154","materialUnit":1.0,"stock":null,"iqc":null,"dayOver":null,"localStock":null}];
                // let res = [{"workNo":"61SF01-2205000231","materialNo":"45300825","materialUnit":16.0,"stock":371073,"realStock":415073,"iqc":0,"dayOver":64000,"localStock":20000.0,"otherGet":{"61SF01-2205000229":44000}},{"workNo":"61SF01-2205000231","materialNo":"45701763","materialUnit":1.0,"stock":3334,"realStock":3334,"iqc":16000,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45300528","materialUnit":23.0,"stock":30874,"realStock":122874,"iqc":0,"dayOver":92000,"localStock":null,"otherGet":{"61SF01-2205000229":92000}},{"workNo":"61SF01-2205000231","materialNo":"45300549","materialUnit":25.0,"stock":833459,"realStock":833459,"iqc":0,"dayOver":100000,"localStock":116000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45300802","materialUnit":1.0,"stock":4862,"realStock":4862,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45902109","materialUnit":1.0,"stock":18537,"realStock":18537,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45902070","materialUnit":4.0,"stock":81290,"realStock":89290,"iqc":0,"dayOver":16000,"localStock":8000.0,"otherGet":{"61SF01-2205000229":8000}},{"workNo":"61SF01-2205000231","materialNo":"42300255","materialUnit":1.0,"stock":4872,"realStock":4872,"iqc":45000,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"47407867","materialUnit":1.0,"stock":null,"realStock":null,"iqc":null,"dayOver":4000,"localStock":null,"otherGet":{}},{"workNo":"61SF01-2205000231","materialNo":"45300800","materialUnit":1.0,"stock":-4000,"realStock":0,"iqc":2090,"dayOver":4000,"localStock":null,"otherGet":{"61SF01-2205000229":4000}},{"workNo":"61SF01-2205000231","materialNo":"31104996","materialUnit":1.0,"stock":860,"realStock":4860,"iqc":0,"dayOver":4000,"localStock":null,"otherGet":{"61SF01-2205000229":4000}},{"workNo":"61SF01-2205000231","materialNo":"31201535","materialUnit":1.0,"stock":30998,"realStock":34998,"iqc":0,"dayOver":4000,"localStock":null,"otherGet":{"61SF01-2205000229":4000}},{"workNo":"61SF01-2205000231","materialNo":"45701737","materialUnit":2.0,"stock":10245,"realStock":10245,"iqc":0,"dayOver":8000,"localStock":8000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45902016","materialUnit":1.0,"stock":22713,"realStock":22713,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45902059","materialUnit":1.0,"stock":78232,"realStock":78232,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"31105002","materialUnit":2.0,"stock":72400,"realStock":80400,"iqc":0,"dayOver":8000,"localStock":null,"otherGet":{"61SF01-2205000229":8000}},{"workNo":"61SF01-2205000231","materialNo":"31105001","materialUnit":1.0,"stock":null,"realStock":null,"iqc":null,"dayOver":4000,"localStock":null,"otherGet":{}},{"workNo":"61SF01-2205000231","materialNo":"45701779","materialUnit":2.0,"stock":-3700,"realStock":4300,"iqc":0,"dayOver":8000,"localStock":null,"otherGet":{"61SF01-2205000229":8000}},{"workNo":"61SF01-2205000231","materialNo":"31105000","materialUnit":1.0,"stock":null,"realStock":null,"iqc":null,"dayOver":4000,"localStock":null,"otherGet":{}},{"workNo":"61SF01-2205000231","materialNo":"81300251","materialUnit":2.0,"stock":15882,"realStock":19837,"iqc":0,"dayOver":8000,"localStock":4045.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"31104999","materialUnit":1.0,"stock":null,"realStock":null,"iqc":null,"dayOver":4000,"localStock":null,"otherGet":{}},{"workNo":"61SF01-2205000231","materialNo":"31104998","materialUnit":2.0,"stock":null,"realStock":null,"iqc":null,"dayOver":8000,"localStock":null,"otherGet":{}},{"workNo":"61SF01-2205000231","materialNo":"45700260","materialUnit":1.0,"stock":3288,"realStock":3288,"iqc":15030,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45300632","materialUnit":8.0,"stock":10846,"realStock":42846,"iqc":72000,"dayOver":32000,"localStock":null,"otherGet":{"61SF01-2205000229":16000}},{"workNo":"61SF01-2205000231","materialNo":"49200055","materialUnit":0.3,"stock":25716,"realStock":26916,"iqc":0,"dayOver":1200,"localStock":null,"otherGet":{"61SF01-2205000229":1200}},{"workNo":"61SF01-2205000231","materialNo":"45500744","materialUnit":1.0,"stock":2601,"realStock":6601,"iqc":0,"dayOver":4000,"localStock":null,"otherGet":{"61SF01-2205000229":4000}},{"workNo":"61SF01-2205000231","materialNo":"45500743","materialUnit":1.0,"stock":16644,"realStock":16644,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"31602897","materialUnit":1.0,"stock":6413,"realStock":6413,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45500748","materialUnit":4.0,"stock":33847,"realStock":49847,"iqc":50000,"dayOver":16000,"localStock":null,"otherGet":{"61SF01-2205000229":16000}},{"workNo":"61SF01-2205000231","materialNo":"31602895","materialUnit":1.0,"stock":6078,"realStock":10078,"iqc":0,"dayOver":4000,"localStock":null,"otherGet":{"61SF01-2205000229":4000}},{"workNo":"61SF01-2205000231","materialNo":"31602896","materialUnit":1.0,"stock":-1595,"realStock":2405,"iqc":0,"dayOver":4000,"localStock":null,"otherGet":{"61SF01-2205000229":4000}},{"workNo":"61SF01-2205000231","materialNo":"45902084","materialUnit":1.0,"stock":null,"realStock":null,"iqc":null,"dayOver":4000,"localStock":null,"otherGet":{}},{"workNo":"61SF01-2205000231","materialNo":"31602893","materialUnit":1.0,"stock":6514,"realStock":6514,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"45902083","materialUnit":4.0,"stock":-857,"realStock":0,"iqc":12000,"dayOver":16000,"localStock":15143.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"32202360","materialUnit":2.0,"stock":null,"realStock":null,"iqc":null,"dayOver":8000,"localStock":null,"otherGet":{}},{"workNo":"61SF01-2205000231","materialNo":"42001402","materialUnit":1.0,"stock":8275,"realStock":8275,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"42001403","materialUnit":1.0,"stock":5597,"realStock":5597,"iqc":0,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"43001499","materialUnit":1.0,"stock":317,"realStock":4317,"iqc":0,"dayOver":4000,"localStock":null,"otherGet":{"61SF01-2205000229":4000}},{"workNo":"61SF01-2205000231","materialNo":"81200755","materialUnit":2.0,"stock":38515,"realStock":46515,"iqc":0,"dayOver":8000,"localStock":null,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"43001498","materialUnit":1.0,"stock":null,"realStock":null,"iqc":null,"dayOver":4000,"localStock":null,"otherGet":{}},{"workNo":"61SF01-2205000231","materialNo":"43001497","materialUnit":1.0,"stock":4310,"realStock":4310,"iqc":18700,"dayOver":4000,"localStock":4000.0,"otherGet":{"61SF01-2205000229":0}},{"workNo":"61SF01-2205000231","materialNo":"序列号标签","materialUnit":2.0,"stock":null,"realStock":null,"iqc":null,"dayOver":8000,"localStock":null,"otherGet":{}}]
                // this.handleDate(res);
            },
            handleDate(res) {
                console.log(res);

                if (!isArrayAndHasLength(res)) {
                    return []
                }

                // 筛选
                res = res.filter(item => item['type'] === this.subArea);

                // 排序（先把stock===null的拿出来，然后）
                // let stockNullList = [];
                // for (let t of res){
                //     if (t['stock'] === null) {
                //         stockNullList.push(t)
                //     }
                // }

                // console.log(res.unshift(res.filter(item => item['stock'] === null)));
                // console.log(res.filter(item => item['stock'] === null))
                // console.log(stockNullList);
                res = res.filter(item => item['stock'] === null).concat(res.filter(item => item['stock'] !== null))
                res = res.sort((a, b) => {
                    return a['stock'] - b['stock']
                });
                console.log(res);

                for (let t of res) {
                    t['expand'] = false;
                }

                this.tableData = res;
            }
        },
        created() {
            // 参数处理
            // console.log(this.$route.query);
            this.workNo = this.$route.query.workNo;
            this.materialCode = this.$route.query.materialCode;
            this.subArea = this.$route.query.subArea;
            // console.log(this.workNo)
            // console.log(this.materialCode)
            // console.log(this.subArea)

            // 请求数据
            this.getMaterialDetailList();
        }
    }
</script>

<style>
    .row-expand-unhas .el-table__expand-column {
        pointer-events: none;
    }

    .row-expand-unhas .el-table__expand-column .el-icon {
        visibility: hidden;
    }

    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }

    .el-table .remark-row {
        background: #e8e8e8;
    }


</style>

<style scoped lang="less">

    .abc {
        ::v-deep .el-table th.el-table__cell {
            background-color: #e8e8e8;
        }
    }

    .small-zero {
        color: red;
    }

    .table-expand-cell {
        background-color: #eef0f4;

        .table-expand-cell-line {
            padding: 5px 20px;

            .small-zero {
                color: red;
            }

            /*.big-zero {*/
            /*    color: red;*/
            /*}  */
        }
    }

</style>
