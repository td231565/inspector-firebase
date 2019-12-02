<template>
  <div class="print" ref="printTable">
    <div class="print__controls flex--right">
      <p v-if="errorText">{{ errorText }}</p>
      <button class="btn btn__square btn__square--success" @click="printPage">列印</button>
      <button class="btn btn__square btn__square--success" @click="exportToDoc">匯出word</button>
      <button class="btn btn__square btn__square--success" @click="finishPrint">上一步</button>
    </div>

    <h1 class="print__header">BIM 自主查驗表</h1>

    <ul class="print__main">
      <!-- 查驗項目基本資料 -->
      <li class="print__row print__column">
        <p>工程名稱：{{ projectName }}</p>
      </li>
      <li class="print__row">
        <p class="print__column print__column__left">查驗日期：{{ date }}</p>
        <p class="print__column print__column__right">編號：</p>
      </li>
      <li class="print__row print__column">
        <p>查驗項目：{{ modelInfo.modelName }}</p>
      </li>
      <li class="print__row print__column">
        <span>查驗類型：</span>
        <input type="checkbox" v-model="checkboxAr" disabled /><label>建築</label>
        <input type="checkbox" v-model="checkboxSt" disabled /><label>結構</label>
        <input type="checkbox" v-model="checkboxMep" disabled /><label>MEP</label>
        <input type="checkbox" v-model="checkboxIct" disabled /><label>ICT</label>
      </li>
      <li class="print__row">
        <p class="print__column">位置/圖號：{{ issue }}</p>
        <p class="print__column">查驗人員：{{ inspector }}</p>
        <p class="print__column">隨行人員：{{ accompany }}</p>
      </li>
      <!-- 查驗內容結果 -->
      <li class="print__row print__column">查驗內容結果</li>
      <li class="print__row">
        <div class="print__column">
          <p>自主檢查紀錄是否提送：</p>
          <div>
            <input type="checkbox" v-model="selfCheckYes" disabled /><label>符合</label>
            <input type="checkbox" v-model="selfCheckNo" disabled /><label>不符合</label>
          </div>
          <p>圖說與模型是否一致：</p>
          <div>
            <input type="checkbox" v-model="statusYes" disabled /><label>符合</label>
            <input type="checkbox" v-model="statusNo" disabled /><label>不符合</label>
          </div>
        </div>

        <div class="print__column">
          <p>不符合處之檢核結果說明：</p>
          <div class="problem"
            v-for="(mission, index) in missionsWithStatusNo"
            :key="index+20">
            <p>{{ mission.name }}：</p>
            <pre v-html="mission.problem"></pre>
          </div>
        </div>
      </li>
      <!-- 查驗意見與圖片 -->
      <li class="print__row print__column">查驗意見</li>
      <!-- <li class="print__row print__column"><strong>現場與模型核對皆相符</strong></li> -->
      <li class="print__row print__row--block print__column">
        <p>現場與模型核對皆相符</p>
        <printItem
          class="print__column print__column--borderless"
          v-for="(mission, index) in missionsWithStatusYes"
          :key="index+1"
          :mission="mission" />
      </li>
      <!-- <li class="print__row print__column"><strong>現場與模型核對不相符</strong></li> -->
      <li class="print__row print__row--block print__column">
        <p>現場與模型核對不相符</p>
        <printItem
          class="print__column print__column--borderless"
          v-for="(mission, index) in missionsWithStatusNo"
          :key="index+10"
          :mission="mission" />
      </li>
      <!-- 簽名 -->
      <li class="print__row print__column signature">查驗人員簽名：</li>
    </ul>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../config/db'
import printItem from '../components/PrintItem'
import html2Doc from '../config/html2doc'

export default {
  name: 'Print',
  components: {
    printItem
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
      errorText: ''
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
      let table = this.$refs.printTable
      html2Doc(table, 'BIM自主查驗報表')
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
  > pre
    margin: 0

.signature
  height: 70px
  display: flex
  flex-direction: column
  justify-content: flex-end

@media print
  // @page
  //   size: A4 portrait // 大小、方向 portrait/landscape
  //   margin: 0.5cm
  //   orphans:4
  //   widows:2

  .print
    width: 100%
    margin: 0
    padding: 0
    border: none
    &__controls
      display: none
</style>