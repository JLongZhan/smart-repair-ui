<template>
  <div class="index-material">
    <router-view></router-view>
    <div class="material-wrapper" v-show="$route.meta.index===1">
      <van-nav-bar
          left-text="返回"
          :title="$route.meta.title"
          left-arrow
          @click-left="onClickLeft"
      />
      <!--<van-card-->
      <!--    num="2"-->
      <!--    price="2.00"-->
      <!--    desc="描述信息"-->
      <!--    title="商品标题"-->
      <!--    thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"-->
      <!--/>-->
      <!--内容-->
      <!--搜索框-->
      <div class="search">
        <!--<div>dd</div>-->
        <!--<div>dd</div>-->
        <!--<div>dd</div>-->
        <!--<div>dd</div>-->

        <van-dropdown-menu active-color="#1989fa">
          <van-dropdown-item v-model="value1" :options="option1" @change="change"/>
          <van-dropdown-item v-model="value2" :options="option2" @change="change"/>
          <van-dropdown-item v-model="value3" :options="option3" @change="change"/>
          <van-dropdown-item v-model="value4" :options="option4" @change="change"/>
        </van-dropdown-menu>
      </div>
      <div v-if="innerWidth<=600">
        <!--内容-->
        <div class="content">
          <div v-for="(bigSheetItem, index) in tableList" :key="index">
            <!--大工单-->
            <div class="section">
              <van-divider
                  content-position="center"
                  :style="{ borderColor: '#666', padding: '0 10px' }"
              >
                <!--{{bigSheetItem['bigSheet']}}-->
                {{ bigSheetItem['materialName'] }}({{ bigSheetItem['materialCode'] }})
                <!--{{bigSheetItem}}-->
              </van-divider>
            </div>
            <div class="sheet-cell"
                 v-for="(sheetItem, index) in bigSheetItem['sheetListInBigSheet']"
                 :key="index"
                 @click="clickTableRow(sheetItem)"
            >

              <div class="material-full-set-value-not-row">

                <div class="sheet-cell-wrap">
                  <div class="sheet-cell-column1">
                    <div>{{ sheetItem['subArea'] }}</div>
                  </div>
                  <div style="background-color: #fff;">
                    <div style="padding: 10px">
                      <div class="sheet-cell-column2">
                        <!--<div style="display: flex; justify-content: center">工单进度</div>-->
                        <div style="display: flex; justify-content: center; font-size: 0.8rem; font-weight: 700">
                          物料齐套率
                        </div>
                        <div class="sheet-cell-product-circle">
                          <van-circle
                              :current-rate="getMaterialCurrentRate(sheetItem)"
                              :stroke-width="100"
                              layer-color="#ebedf0"
                              :color="sheetItem.fullSetValue >= 1 ? '#67c23a':'orange'"
                              :clockwise="false"
                              size="115px"
                              start-position="top"
                          >
                            <template v-slot:default>
                              <div class="sheet-cell-circle-slot">
                                <!--{{sheetItem['planQty']}}-->
                                <!--{{sheetItem['actualQty']}}-->
                                <div>
                                  <!--<div>-->
                                  <!--    {{sheetItem['qty']}}-->
                                  <!--</div>-->
                                  <div :class="['circle-text', sheetItem.fullSetValue >= 1 ? 'ok':'notOk']">
                                    {{ textCurrentMaterial(sheetItem) }}
                                    <!--{{sheetItem['alreadyProduct']}}({{textCurrentProduct(sheetItem)}})-->
                                  </div>
                                  <!--<div>-->
                                  <!--    {{sheetItem['qty'] - sheetItem['alreadyProduct']}}({{textNotCurrentProduct(sheetItem)}})-->
                                  <!--</div>-->
                                </div>
                              </div>
                            </template>
                          </van-circle>
                        </div>
                        <div
                            style="height: 25px; display: flex; justify-content: space-between; align-items: end; padding-top: 10px">
                          <div style="font-size: 0.7rem">种类: {{ sheetItem['materialTypes'] }}
                          </div>
                          <div style="font-size: 0.7rem">预警: {{
                              sheetItem['materialTypes'] -
                              sheetItem['alreadyMaterial']
                            }}
                          </div>
                        </div>
                      </div>

                    </div>
                    <!--<Progress-->
                    <!--        :current-rate="getMaterialFullSetValue(sheetItem['alreadyMaterial'], sheetItem['materialTypes'])"-->
                    <!--        :current-number="sheetItem['alreadyMaterial']"-->
                    <!--        :total="sheetItem.materialTypes"-->
                    <!--&gt;</Progress>-->
                  </div>

                  <div class="sheet-cell-column3" style="background-color: #fff;">
                    <div class="sheet-cell-column3-wrap">
                      <div>
                        <div style="line-height: 30px; font-size: 0.8rem; font-weight: 700">
                          生产据点：<span style="font-weight: normal">S61</span></div>
                        <div style="line-height: 30px; font-size: 0.8rem; font-weight: 700">
                          工单编号：<span style="font-weight: normal">{{ sheetItem['productOrderNo'] }}</span>
                        </div>
                        <div style="line-height: 30px; font-size: 0.8rem; font-weight: 700">
                          上线时间：<span
                            style="font-weight: normal">{{ sheetItem['orderDate'] }}</span>
                        </div>
                        <div style="line-height: 30px; font-size: 0.8rem; font-weight: 700">
                          生产线别：<span style="font-weight: normal">{{ sheetItem['line'] }}</span>
                        </div>
                        <div style="line-height: 30px; font-size: 0.8rem; font-weight: 700">
                          工单进度：
                          <span style="font-weight: normal">
                                                        {{ sheetItem['alreadyProduct'] }}/{{ sheetItem['qty'] }}
                                                    </span>
                        </div>
                        <div style="padding-top: 8px">
                          <div style="position: relative">
                            <el-progress
                                status="success"
                                :text-inside="true"
                                :show-text="getProductCurrentPercent(sheetItem) <= 100"
                                :stroke-width="26"
                                :percentage="getProductCurrentPercentSmall100(sheetItem)"/>
                            <span v-show="getProductCurrentPercent(sheetItem)>100"
                                  style="position:absolute; right: 10px; top: 0; line-height: 26px; color: white">
                                                            {{ getProductCurrentPercent(sheetItem) + '%' }}
                                                        </span>
                          </div>

                          <!--<Progress :percentage="getProductCurrentPercent(sheetItem)"></Progress>-->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="innerWidth>600">
        <div v-for="(bigSheetItem, index) in tableList" :key="index">
          <!--大工单-->
          <div class="section">
            <van-divider
                content-position="left"
                :style="{ borderColor: '#666', padding: '10px 10px' }"
            >
              <!--{{bigSheetItem['bigSheet']}}-->
              {{ bigSheetItem['materialName'] }}({{ bigSheetItem['materialCode'] }})
            </van-divider>
          </div>
          <el-table
              :data="bigSheetItem['sheetListInBigSheet']"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              @row-click="clickTableRow"
          >
            <el-table-column align="center" label="工段" prop="subArea"/>
            <el-table-column align="center" label="生产据点" prop="siteId"/>
            <el-table-column align="center" label="工单编号" prop="productOrderNo"/>
            <el-table-column align="center" label="上线时间" prop="orderDate"/>
            <el-table-column align="center" label="生产线别" prop="line"/>
            <el-table-column align="center" label="物料齐套率">
              <template #default="props">
                <div>
                  <div>
                    <van-circle
                        :current-rate="getMaterialCurrentRate(props.row)"
                        :stroke-width="100"
                        layer-color="#ebedf0"
                        color="orange"
                        :clockwise="false"
                        size="60px"
                        start-position="top"
                        :text="textCurrentMaterial(props.row)"
                    />
                    <!--<template v-slot:default>-->
                    <!--    <div class="">-->
                    <!--            <div :class="['circle-text', sheetItem.fullSetValue >= 1 ? 'ok':'notOk']" >-->
                    <!--                {{textCurrentMaterial(sheetItem)}}-->
                    <!--                &lt;!&ndash;{{sheetItem['alreadyProduct']}}({{textCurrentProduct(sheetItem)}})&ndash;&gt;-->
                    <!--            </div>-->
                    <!--    </div>-->
                    <!--</template>-->
                    <!--</van-circle>-->
                    <div style="display: flex; justify-content: space-between">
                      <div style="font-size: 0.7rem">种类: {{ props.row['materialTypes'] }}</div>
                      <div style="font-size: 0.7rem">预警: {{
                          props.row['materialTypes'] -
                          props.row['alreadyMaterial']
                        }}
                      </div>
                    </div>
                  </div>
                </div>

              </template>
            </el-table-column>
            <el-table-column align="center" label="工单进度" min-width="150">
              <template #default="props">
                <div>
                  <div style="font-weight: normal; text-align: start">
                    {{ props.row['alreadyProduct'] }}/{{ props.row['qty'] }}
                  </div>
                  <!--<el-progress status="success" :text-inside="true" :stroke-width="15"-->
                  <!--             :percentage="getProductCurrentPercent(props.row)"/>-->
                  <div style="position: relative">
                    <el-progress
                        status="success"
                        :text-inside="true"
                        :show-text="getProductCurrentPercent(props.row) <= 100"
                        :stroke-width="26"
                        :percentage="getProductCurrentPercentSmall100(props.row)"/>
                    <span v-show="getProductCurrentPercent(props.row)>100"
                          style="position:absolute; right: 10px; top: 0; line-height: 26px; color: white">
                                                            {{ getProductCurrentPercent(props.row) + '%' }}
                                                        </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!--<el-table-column type="expand">-->
            <!--    <template #default="props">-->
            <!--        <div class="table-expand-cell">-->
            <!--            <div class="table-expand-cell-line">工单：{{props['row']['workNo']}}</div>-->
            <!--            <div class="table-expand-cell-line">物料：{{props['row']['materialNo']}}</div>-->
            <!--            <div class="table-expand-cell-line">规格：-&#45;&#45;</div>-->
            <!--            <div class="table-expand-cell-line">单位产品标准用料数量：{{props['row']['materialUnit']}}</div>-->
            <!--            <div class="table-expand-cell-line">日工单剩余产品计划耗用物料数量：{{props['row']['dayOver']}}</div>-->
            <!--            <div class="table-expand-cell-line">库存数量：{{props['row']['stock']}}</div>-->
            <!--            <div class="table-expand-cell-line">待IQC数量：{{props['row']['iqc']}}</div>-->
            <!--            <div class="table-expand-cell-line">线边仓量：-&#45;&#45; </div>-->
            <!--        </div>-->
            <!--    </template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {
  dateToStr, deepCopy,
  isArrayAndHasLength,
  isObjectAndContainKey,
  itemListToSomeKeyNoRepeatList,
  itemListToValueList
} from "./support_method";
import {Toast} from "vant";
import resizeMixin from "./resizeMixin";
import Progress from './Progress'
import {Edit} from '@element-plus/icons-vue'

export default {
  name: "index",
  mixins: [resizeMixin],
  components: {Progress},
  data() {
    return {
      tableList: [],

      value1: null,
      value2: null,
      value3: null,
      value4: null,
      option1: [],
      option2: [{text: 'All', value: 'All'},],
      option3: [{text: 'All', value: 'All'},], // this.getDateList(),
      option4: [{text: 'All', value: 'All'},],

      copyRes: [],
    }
  },
  methods: {
    getProductCurrentPercent(sheetItem) {
      // return 110;
      return (sheetItem['alreadyProduct'] / sheetItem['qty'] * 100).toDecimal(0)
    },
    getProductCurrentPercentSmall100(sheetItem) {
      let value = (sheetItem['alreadyProduct'] / sheetItem['qty'] * 100).toDecimal(0);
      // value = 110;
      if (value > 100) {
        return 100;
      } else {
        return value;
      }
    },
    textCurrentMaterial(sheetItem) {
      return ((sheetItem['alreadyMaterial'] / sheetItem['materialTypes']) * 100).toFixed(0) + '%'
      // return (sheetItem['alreadyProduct'] / sheetItem['qty']).toDecimal(2) * 100 + '%' || 0
    },
    textNotCurrentProduct(sheetItem) {
      return (1 - sheetItem['alreadyProduct'] / sheetItem['qty']).toDecimal(2) * 100 + '%' || 0
    },
    getMaterialCurrentRate(sheetItem) {
      // console.log(sheetItem['alreadyProduct']);
      // console.log(sheetItem['alreadyProduct']/sheetItem['qty']*100);
      return sheetItem['alreadyMaterial'] / sheetItem['materialTypes'] * 100
    },
    getDateList() {
      let dateList = [];
      for (let i = 0; i < 5; i++) {
        dateList.push({
          text: dateToStr(new Date((new Date()).getTime() + 24 * 3600000 * i)),
          value: dateToStr(new Date((new Date()).getTime() + 24 * 3600000 * i))
        })
      }
      return dateList
    },
    getCurrentDate() {
      return dateToStr(new Date())
    },
    getNextDate() {
      // console.log(dateToStr(new Date((new Date()).getTime() + 24 * 3600000)));
      return dateToStr(new Date((new Date()).getTime() + 24 * 3600000))
      // console.log(value((new Date()).getTime()))
    },
    // 给颜色
    tableRowClassName({row, rowIndex}) {
      // console.log(row['fullSetValue'])
      if (row['fullSetValue'] < 1) {
        return 'material-full-set-value-not-row';
      }
      // else if (rowIndex === 3) {
      //     return 'success-row';
      // }
      return '';
    },
    // 表格行被点击
    clickTableRow(row) {
      console.log(row);
      // console.log(column)
      // console.log(event)

      this.$router.push({
        name: 'MaterialDetail',
        query: {workNo: row['productOrderNo'], materialCode: row['materialCode'], subArea: row['subArea']}
      })

    },
    // 点击跳转详情
    // clickToMaterialDetail(sheetItem) {
    //     // console.log(bigSheetItem['bigSheet']);
    //     // console.log(sheetItem['materialCode']);
    //     this.$router.push({
    //         name: 'MaterialDetail',
    //         // query: {workNo: bigSheetItem['bigSheet'], materialCode: sheetItem['materialCode'], subArea: sheetItem['subArea'] }
    //         query: {workNo: sheetItem['productOrderNo'], materialCode: sheetItem['materialCode'], subArea: sheetItem['subArea'] }
    //     })
    // },
    // 筛选
    change() {
      let res = this.copyRes.filter(item => item['siteId'] === this.value1);
      if (this.value2 !== 'All') {
        res = res.filter(item => item['line'] === this.value2);
      }
      if (this.value3 !== 'All') {
        res = res.filter(item => item['orderDate'] === this.value3);
      }
      if (this.value4 !== 'All') {
        res = res.filter(item => item['subArea'] === this.value4);
      }
      this.resToTableData(res);
    },

    // 获取物料齐套状态
    getMaterialFullSetValue(alreadyMaterial, materialTypes) {
      // console.log((alreadyMaterial/materialTypes).toDecimal(2)*100 + '%');
      if (materialTypes === 0) {
        return 1
      }
      return (alreadyMaterial / materialTypes).toDecimal(2)
    },
    // btnText获取物料齐套状态
    btnTextGetMaterialFullSetValue(alreadyMaterial, materialTypes) {
      // console.log((alreadyMaterial/materialTypes).toDecimal(2)*100 + '%');
      return this.getMaterialFullSetValue(alreadyMaterial, materialTypes) * 100 + '%';
    },
    // 返回
    onClickLeft() {
      // history.back();
      this.$router.push('/menu')
    },
    // 请求数据
    getMaterialList() {
      let param = {};
      this.$api.Material.getWorkPlan(param)
          .then(res => {
            console.log(res);

            // Toast提示
            if (isObjectAndContainKey(res, 'message')) {
              Toast(res['message']);
            }

            // 处理数据
            this.handleData(res);
            // this.handleData([]);
          })
          .catch(err => {
            console.log(err);
          });

      // let res = [{"siteId":"S61","orderDate":"2022-05-28","name":"61SF01-2205000062-1","line":"LB1线","materialCode":"11300154","planQty":1.0,"actualQty":17.0,"productOrderNo":"61SF01-2205000062","qty":576.0,"inputQty":15.0,"status":"RUNNING","subArea":"组装","materialTypes":42,"alreadyMaterial":33,"alreadyProduct":485.0,"unAlreadyMaterial":{"42001295":576,"32201559":576,"32201859":576,"45701481":576,"49200055":97,"31104262":1152,"31104260":576,"47406027":576,"31301154":576,"31104248":576,"32201560":576,"31602471":576,"31602470":576}}];
      // let res =[{"siteId":"S61","orderDate":"2022-06-08","name":"61SF01-2205000191-4","line":"LA2线","materialCode":"11400500","planQty":2000.0,"actualQty":0.0,"productOrderNo":"61SF01-2205000191","qty":2000.0,"inputQty":0.0,"status":"confirm","subArea":"组装","materialTypes":42,"alreadyMaterial":33,"alreadyProduct":330.0,"unAlreadyMaterial":{"47407867":2000,"31105001":2000,"31105000":2000,"31104999":2000,"31104998":4000,"45902084":2000,"32202360":4000,"43001498":2000,"序列号标签":4000}},{"siteId":"S61","orderDate":"2022-06-08","name":"61SF01-2205000189-3","line":"LA2线","materialCode":"11400500","planQty":1.0,"actualQty":0.0,"productOrderNo":"61SF01-2205000189","qty":2000.0,"inputQty":519.0,"status":"RUNNING","subArea":"组装","materialTypes":42,"alreadyMaterial":33,"alreadyProduct":150.0,"unAlreadyMaterial":{"31104999":2000,"31104998":4000,"47407867":2000,"45902084":2000,"32202360":4000,"31105001":2000,"43001498":2000,"31105000":2000,"序列号标签":4000}},{"siteId":"S61","orderDate":"2022-06-08","name":"61SF01-2205000225-1","line":"LB1线","materialCode":"11300154","planQty":400.0,"actualQty":0.0,"productOrderNo":"61SF01-2205000225","qty":400.0,"inputQty":98.0,"status":"RUNNING","subArea":"组装","materialTypes":42,"alreadyMaterial":33,"alreadyProduct":0.0,"unAlreadyMaterial":{"32201559":400,"31104262":800,"31104260":400,"47406027":400,"31301154":400,"31104248":400,"32201560":400,"31602471":400,"31602470":400}},{"siteId":"S61","orderDate":"2022-06-08","name":"61SF01-2205000193-1","line":"LA1线","materialCode":"11400500","planQty":1600.0,"actualQty":0.0,"productOrderNo":"61SF01-2205000193","qty":2000.0,"inputQty":0.0,"status":"confirm","subArea":"组装","materialTypes":42,"alreadyMaterial":32,"alreadyProduct":0.0,"unAlreadyMaterial":{"47407867":2000,"31105001":2000,"31105000":2000,"31104999":2000,"31104998":4000,"31602897":2000,"45902084":2000,"32202360":4000,"43001498":2000,"序列号标签":4000}},{"siteId":"S61","orderDate":"2022-06-08","name":"61SF01-2205000195-1","line":"LA1线","materialCode":"11400500","planQty":2.0,"actualQty":0.0,"productOrderNo":"61SF01-2205000195","qty":2000.0,"inputQty":0.0,"status":"confirm","subArea":"组装","materialTypes":42,"alreadyMaterial":32,"alreadyProduct":0.0,"unAlreadyMaterial":{"47407867":2000,"31105001":2000,"31105000":2000,"31104999":2000,"31104998":4000,"31602897":2000,"45902084":2000,"32202360":4000,"43001498":2000,"序列号标签":4000}}]
      // let res = [{"siteId":"S61","orderDate":"2022-06-10","name":"61SF01-2205000229-5","line":"LA2线","materialCode":"11400500","planQty":2000.0,"actualQty":0.0,"productOrderNo":"61SF01-2205000229","qty":4000.0,"inputQty":841.0,"status":"RUNNING","subArea":"组装","materialName":"W-2169","materialTypes":42,"alreadyMaterial":29,"alreadyProduct":44.0,"unAlreadyMaterial":{"47407867":4000,"45300800":4000,"31105001":4000,"45701779":8000,"31105000":4000,"31104999":4000,"31104998":8000,"45500744":4000,"31602896":4000,"45902084":4000,"32202360":8000,"43001498":4000,"序列号标签":8000}},{"siteId":"S61","orderDate":"2022-06-10","name":"61SF01-2205000231-1","line":"LA1线","materialCode":"11400500","planQty":2000.0,"actualQty":0.0,"productOrderNo":"61SF01-2205000231","qty":4000.0,"inputQty":720.0,"status":"RUNNING","subArea":"组装","materialName":"W-2169","materialTypes":42,"alreadyMaterial":23,"alreadyProduct":0.0,"unAlreadyMaterial":{"45300528":92000,"47407867":4000,"45300800":4000,"31104996":4000,"31105001":4000,"45701779":8000,"31105000":4000,"31104999":4000,"31104998":8000,"45300632":32000,"45500744":4000,"45500748":16000,"31602896":4000,"45902084":4000,"45902083":857,"32202360":8000,"43001499":4000,"43001498":4000,"序列号标签":8000}}]
      // this.handleData(res);
    },
    // 处理数据
    handleData(res) {
      if (!isArrayAndHasLength(res)) {
        return []
      }
      console.log(res);

      // 拷贝保存
      this.copyRes = deepCopy(res);

      // 把res转换成table能够显示的数据
      this.resToTableData(this.copyRes);

      // 筛选的所有可选项
      let siteIdList = itemListToSomeKeyNoRepeatList(res, ['siteId']);
      for (let t of siteIdList) {
        this.option1.push({
          text: t['siteId'],
          value: t['siteId']
        })
      }

      let lineList = itemListToSomeKeyNoRepeatList(res, ['line']);
      for (let t of lineList) {
        this.option2.push({
          text: t['line'],
          value: t['line']
        })
      }

      let orderDateList = itemListToSomeKeyNoRepeatList(res, ['orderDate']);
      for (let t of orderDateList) {
        this.option3.push({
          text: t['orderDate'],
          value: t['orderDate']
        })
      }

      let subAreaList = itemListToSomeKeyNoRepeatList(res, ['subArea']);
      for (let t of subAreaList) {
        this.option4.push({
          text: t['subArea'],
          value: t['subArea']
        })
      }

      // 筛选默认值
      // this.option1 = [{text: 'ab', value: 'ab'}];
      if (isArrayAndHasLength(this.option1)) {
        let isContainS61 = this.option1.isContainObject({text: 'S61', value: 'S61'}, 'value');
        if (isContainS61) {
          this.value1 = 'S61'
        } else {
          this.value1 = this.option1[0]['value'];
        }
      }

      if (isArrayAndHasLength(this.option2)) {
        this.value2 = this.option2[0]['value'];
      }

      if (isArrayAndHasLength(this.option3)) {
        this.value3 = this.option3[0]['value'];
      }

      if (isArrayAndHasLength(this.option4)) {
        this.value4 = this.option4[0]['value'];
      }

      this.change();
    },
    // 把res转换成table能够显示的数据
    resToTableData(res) {
      // 物料齐备状态：
      for (let t of res) {
        t['fullSetValue'] = this.getMaterialFullSetValue(t['alreadyMaterial'], t['materialTypes'])
        t['fullSetPercent'] = this.getMaterialFullSetValue(t['alreadyMaterial'], t['materialTypes']) * 100 + '%'
      }
      // console.log(res);

      // 大工单列表
      let bigSheetList = itemListToValueList(res, 'productOrderNo').removeRepeat().sort((a, b) => a - b);
      // console.log(bigSheetList);
      // let categoryList = itemListToSomeKeyNoRepeatList(res, ['productOrderNo']);
      // console.log(categoryList)

      let tableList = [];
      for (let t of bigSheetList) {
        let sheetListInBigSheet = res.filter(sheetItem => sheetItem['productOrderNo'] === t);
        // console.log(sheetListInBigSheet);
        // console.log(sheetListInBigSheet[0]['materialCode']);
        tableList.push({
          bigSheet: t,
          materialCode: sheetListInBigSheet[0]['materialCode'],
          materialName: sheetListInBigSheet[0]['materialName'],
          sheetListInBigSheet: sheetListInBigSheet || []
        })
      }
      // console.log(tableList);
      this.tableList = tableList;
    }
  },
  created() {
    // console.log(123)
    this.getMaterialList();

    // 间隔请求
    this.timeoutID = setInterval(() => {
      this.getMaterialList();
    }, 600000);
  },
  destroyed() {
    clearTimeout(this.timeoutID);
  }
}
</script>

<style>
.el-table .material-full-set-value-not-row {
  background: oldlace;
}

</style>

<style scoped lang="less">
.van-divider {
  margin: 0;
}

.index-material {
  /*background-color: #ebedf0;*/
}

.search {
  box-sizing: border-box;
  width: 100%;
  /*height: 50px;*/
  /*background-color: #ebedf0;*/
  padding: 0 0 10px 0;
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: space-between;*/
}

.content {
  /*background-color: #ebedf0;*/
  /*padding: 10px 0 0 0;*/

  .section {
    background-color: #ebedf0;
    padding: 10px;
  }
}


.sheet-cell {
  width: 100%;
  /*height: 50px;*/
  /*background-color: #ebedf0;*/
  /*padding: 0 10px 10px 10px;*/
  box-sizing: border-box;

  /*.sheet-cell-wrap:hover {*/
  /*    background-color: #eef0f4;*/
  /*}*/

  /*.sheet-cell-wrap:active {*/
  /*    background-color: #e4e8ee;*/
  /*}*/

  .ok {
    background-color: #ffffff;
  }

  .material-full-set-value-not-row {
    background-color: oldlace;
  }

  .sheet-cell-wrap {
    display: flex;
    padding: 10px 0 10px 0;
    background-color: #ebedf0;
  }

  .sheet-cell-column1 {
    background-color: rgb(238, 102, 102);
    color: #ffffff;
    writing-mode: vertical-rl;
    letter-spacing: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
  }

  .sheet-cell-column2 {
    flex-grow: 1;

    .sheet-cell-product-circle {
      padding-top: 10px;
      display: flex;
      justify-content: space-between;

      .sheet-cell-circle-slot {
        height: 100%;
        /*background-color: red; */
        display: flex;
        justify-content: center;
        align-items: center;

        .circle-text {
          font-size: 1.6rem;

        }

        .ok {
          color: #67c23a;
        }

        .notOk {
          color: orange;
        }
      }
    }
  }

  .sheet-cell-column3 {
    flex-grow: 1;
    padding: 10px;

    .sheet-cell-column3-wrap {

    }
  }

  /*.sheet-cell-wrap {*/
  /*width: 100%;*/
  /*height: 150px;*/
  /*background-color: #fff;*/
  /*padding: 10px;*/

  .sheet-cell-first-line {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sheet-cell-sheet {
      padding: 15px 10px;
      font-weight: 700;
    }

    .sheet-cell-date {
      padding: 10px;
    }
  }

  .sheet-cell-second-line {
    padding: 0 10px 10px 10px;
    display: flex;
    justify-content: space-between;

    .sheet-cell-second-line-circle-slot {
      height: 100%;
      /*background-color: red; */
      display: flex;
      justify-content: center;
      align-items: center
    }

    .sheet-cell-second-line-right {
      flex-grow: 1;
      padding: 0 0 0 20px;
      /*background-color: red;*/

      .sheet-cell-second-line-right-cell {
        padding: 0 0 8px 0;
      }
    }
  }

  /*}*/
}

@media screen and (max-width: 600px) {

  .circle {
    background-color: red;
    display: flex;
    align-items: center;
    justify-content: center;

    .circle-slot {
      height: 100%;
    }
  }
}
</style>
