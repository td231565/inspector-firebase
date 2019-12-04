<template>
  <div class="print">
    <div class="print__controls flex--right">
      <p v-if="errorText">{{ errorText }}</p>
      <button class="btn btn__square btn__square--success" @click="printPage">列印</button>
      <button class="btn btn__square btn__square--success" @click="exportToDoc">匯出word</button>
      <button class="btn btn__square btn__square--success" @click="finishPrint">上一步</button>
    </div>

    <div ref="printTable">
      <h1 class="print__header">BIM 自主查驗表</h1>

      <table class="print__main" border="1" width="100%">
        <!-- 查驗項目基本資料 -->
        <tr class="print__row">
          <td class="print__column" colspan="6">工程名稱：{{ projectName }}</td>
        </tr>
        <tr class="print__row" :style="style_rowspan">
          <td class="print__column" colspan="3" :style="style_width_col_2">查驗日期：{{ date }}</td>
          <td class="print__column" colspan="3" :style="style_width_col_2">編號：</td>
        </tr>
        <tr class="print__row">
          <td class="print__column" colspan="6">查驗項目：{{ modelInfo.modelName }}</td>
        </tr>
        <tr class="print__row">
          <td class="print__column" colspan="6">
            <span>查驗類型：</span>
            <input type="checkbox" v-model="checkboxAr" disabled /><label>建築</label>
            <input type="checkbox" v-model="checkboxSt" disabled /><label>結構</label>
            <input type="checkbox" v-model="checkboxMep" disabled /><label>MEP</label>
            <input type="checkbox" v-model="checkboxIct" disabled /><label>ICT</label>
          </td>
        </tr>
        <tr class="print__row">
          <td class="print__column" colspan="3" :style="style_width_col_2">位置/圖號：{{ issue }}</td>
          <td class="print__column" colspan="3" :style="style_width_col_2">查驗人員：{{ inspector }}</td>
        </tr>
        <tr class="print__row">
          <td class="print__column" colspan="6">隨行人員：{{ accompany }}</td>
        </tr>
        <!-- 查驗內容結果 -->
        <tr class="print__row">
          <td class="print__column" colspan="6">查驗內容結果</td>
        </tr>

        <tr class="print__row" :style="style_rowspan">
          <td class="print__column" colspan="3" :style="style_width_col_2">自主檢查紀錄是否提送：</td>
          <td class="print__column" colspan="3" :style="style_width_col_2">不符合處之檢核結果說明：</td>
        </tr>

        <tr class="print__row">
          <td class="print__column" colspan="3">
            <input type="checkbox" v-model="selfCheckYes" disabled /><label>符合</label>
            <input type="checkbox" v-model="selfCheckNo" disabled /><label>不符合</label>
          </td>
          <td rowspan="3" colspan="3" class="problem print__column">
            <table class="problem__item"
              v-for="(mission, index) in missionsWithStatusNo"
              :key="index+20"
              :style="style_insideTable"
              align="left">
              <tr>
                <td style="border: none;">{{ mission.name }}：</td>
              </tr>
              <tr>
                <td style="border: none;">
                  <pre class="problem__item__text" v-html="mission.problem">1</pre>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="print__row">
          <td class="print__column" colspan="3">圖說與模型是否一致：</td>
        </tr>

        <tr class="print__row">
          <td class="print__column" colspan="3">
            <input type="checkbox" v-model="statusYes" disabled /><label>符合</label>
            <input type="checkbox" v-model="statusNo" disabled /><label>不符合</label>
          </td>
        </tr>
        <!-- 查驗意見與圖片 -->
        <tr class="print__row">
          <td class="print__column" colspan="6">查驗意見</td>
        </tr>
        <tr class="print__row">
          <td class="print__column" colspan="6">現場與模型核對皆相符</td>
        </tr>
        <tr class="print__row">
          <td class="print__column" colspan="6">
            <printItem
              v-for="(mission, index) in missionsWithStatusYes"
              :key="index+1"
              :mission="mission" />
          </td>
        </tr>
        <tr class="print__row">
          <td class="print__column" colspan="6">現場與模型核對不相符</td>
        </tr>
        <tr class="print__row">
          <td class="print__column" colspan="6">
            <PrintItem
              v-for="(mission, index) in missionsWithStatusNo"
              :key="index+10"
              :mission="mission" />
          </td>
        </tr>
        <!-- 簽名 -->
        <tr class="print__row signature">
          <td class="print__column" colspan="6">查驗人員簽名：</td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../config/db'
import PrintItem from '../components/PrintItem'
import saveDoc from '../config/saveDoc'
// import html2Doc from '../config/html2doc'

export default {
  name: 'Print',
  components: {
    PrintItem
  },
  data () {
    return {
      modelInfo: {},
      missionsData: [],
      projectName: 'P開發計畫 統包工程',
      checkboxAr: false,
      checkboxSt: false,
      checkboxMep: false,
      checkboxIct: false,
      selfCheckNo: false,
      selfCheckYes: true,
      statusNo: false,
      statusYes: true,
      errorText: '',
      // 表格在 Word 中以'文繞圖'排列
      style_insideTable: 'mso-table-overlap:never;mso-table-lspace:9pt;\
        margin-left:3pt;mso-table-rspace:9pt;margin-right:0;\
        mso-table-anchor-vertical:paragraph;mso-table-anchor-horizontal:column;\
        mso-table-left:left;mso-table-top:.05pt;',
      // 表格中 row span
      style_rowspan: 'mso-yfti-irow:2;',
      style_width_col_3: 'width: 33%;',
      style_width_col_2: 'width: 50%;'
    }
  },
  computed: {
    ...mapState({
      modelName: state => state.modelState.modelName,
    }),
    missionsWithStatusYes () {
      if (!this.missionsData || this.missionsData.length === 0) return
      return this.missionsData.filter(mission => mission.status === '符合')
    },
    missionsWithStatusNo () {
      if (!this.missionsData || this.missionsData.length === 0) return
      return this.missionsData.filter(mission => mission.status === '不符合')
    },
    date () {
      if (!this.missionsData || this.missionsData.length === 0) return
      return this.missionsData[0].date.replace('-', '年').replace('-', '月').concat('日')
    },
    checkboxType () {
      if (!this.missionsData || this.missionsData.length === 0) return
      return this.missionsData[0].category
    },
    issue () {
      if (!this.missionsData || this.missionsData.length === 0) return
      return this.missionsData[0].issue
    },
    inspector () {
      if (!this.missionsData || this.missionsData.length === 0) return
      return this.missionsData[0].inspector
    },
    accompany () {
      if (!this.missionsData || this.missionsData.length === 0) return
      return this.missionsData[0].accompany.replace(/,/g, '、')
    }
  },
  methods: {
    finishPrint () {
      this.$emit('finishPrint')
    },
    getMissionData () {
      let vm = this
      db.collection('markersData').doc('gugci_d')
        .collection(this.modelName).get().then(docs => {
          vm.missionsData = []
          docs.forEach(doc => {
            let docData = doc.data()
            doc.id === 'modelInfo'
            ? this.modelInfo = docData
            : vm.missionsData.push(docData)
          })
        })
        .catch(err => this.errorText = err)
    },
    selectCheckboxByType (val) {
      switch (val) {
        case '結構':
          this.checkboxSt = true
          break
        case '建築':
          this.checkboxAr = true
          break
        case 'MEP':
          this.checkboxMep = true
          break
        case 'ICT':
          this.checkboxIct = true
          break
      }
    },
    checkStatusByType () {
      if (this.statusNo === true) return

      this.missionsData.map(mission => {
        if (mission.status === '不符合') {
          this.statusNo = true
          this.statusYes = false
        }
      })
    },
    checkSelfStateByType () {
      if (this.selfCheckNo === true) return

      this.missionsData.map(mission => {
        if (mission.selfCheckState === '不符合') {
          this.selfCheckNo = true
          this.selfCheckYes = false
        }
      })
    },
    printPage () {
      window.print()
    },
    exportToDoc () {
      // let table = document.getElementById('printTable')
      let table = this.$refs.printTable
      // html2Doc(table, 'BIM自主查驗報表')
      saveDoc(table, 'BIM自主查驗報表')
    }
  },
  watch: {
    checkboxType (val) {
      this.selectCheckboxByType(val)
    }
  },
  created () {
    this.getMissionData()
  },
  updated () {
    this.checkStatusByType()
    this.checkSelfStateByType()
  }
}
</script>

<style lang="sass" scoped>
table, tr
  border-collapse: collapse

p
  margin: 0
  padding: 0

.print
  width: 70%
  margin: 1rem auto
  padding: 1rem
  text-align: left
  background-color: #fff
  border: 1px solid $bd_btn_default
  &__column
    padding: 4px 6px
    flex: 1
    border-color: #000
    border-style: solid
    border-width: 1px 1px 0 0
    &--borderless
      border: none
  &__row
    display: flex
    border-left: 1px solid #000
    &:nth-last-child(1)
      border-bottom: 1px solid #000
    &--block
      display: block

.problem
  display: flex
  &__item
    display: inline-block
    &__text
      margin: 0

.signature
  height: 70px
  display: flex
  flex-direction: column
  justify-content: flex-end

@media print
  @page
    .print
      mso-margin: 0.2cm

  .print
    width: 100%
    margin: 0
    padding: 0
    border: none
    &__controls
      display: none
</style>