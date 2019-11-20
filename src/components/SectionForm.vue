<template>
  <section class="home__bottom__section home__bottom__section__form">
    <h3>步驟4：建立 BIM 自主查驗表</h3>
    <ul class="form">
      <li class="form__items">
        <label class="form__items__title">視點名稱</label>
        <input class="form__items__cells" type="text" v-model="name" disabled />
      </li>
      <li class="form__items">
        <label class="form__items__title">樓層位置</label>
        <input class="form__items__cells" type="text" v-model="floor" disabled />
      </li>
      <li class="form__items">
        <label class="form__items__title">查驗人員</label>
        <select class="form__items__cells" v-model="selectedInspector">
          <option>尚未查驗</option>
          <option>{{ inspector }}</option>
        </select>
      </li>
      <li class="form__items">
        <label class="form__items__title">隨行人員</label>
        <input class="form__items__cells" type="text" v-model="accompany" placeholder="以半形逗號區隔" />
      </li>
      <li class="form__items">
        <label class="form__items__title">查驗日期</label>
        <input class="form__items__cells" type="date" v-model="date" placeholder="yyyy-mm-dd"/>
      </li>
      <li class="form__items">
        <label class="form__items__title">查驗類型</label>
        <select class="form__items__cells" v-model="category">
          <option value="建築">建築</option>
          <option value="結構">結構</option>
          <option value="MEP">MEP</option>
          <option value="ICT">ICT</option>
        </select>
      </li>
      <li class="form__items">
        <label class="form__items__title">自主檢查紀錄是否提送</label>
        <select class="form__items__cells" v-model="selfCheckState">
          <option value="符合">符合</option>
          <option value="不符合">不符合</option>
        </select>
      </li>
      <li class="form__items">
        <label class="form__items__title">圖說與模型是否一致</label>
        <select class="form__items__cells" v-model="status">
          <option value="符合">符合</option>
          <option value="不符合">不符合</option>
        </select>
      </li>
      <li class="form__items">
        <label class="form__items__title">檢核結果說明</label>
        <textarea class="form__items__cells log__problem" v-model="problem"></textarea>
      </li>
      <li class="form__items form__items__footer flex--right">
        <div class="form__result flex--center">
          <p class="form__result__text">上傳完成！</p>
        </div>
        <button type="button" class="btn btn__square btn__square--success" @click="updateMission">送出表單</button>
        <button type="button" class="btn btn__square btn__square--danger" v-if="isAdmin" onclick="controlPopframeWarning.reveal()">刪除表單</button>
      </li>
    </ul>
  </section>
</template>

<script>
import { format } from 'date-fns'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'SectionForm',
  data () {
    return {
      name: '名稱',
      floor: '樓層',
      inspector: '',
      selectedInspector: '尚未查驗',
      accompany: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'MEP',
      selfCheckState: '符合',
      status: '符合',
      problem: 'OK',
      isUploadSuccess: null,
      isAdmin: true,
      textError: ''
    }
  },
  computed: {
    ...mapState({
      missionData: state => state.modelState.selectedMarkerData,
      userInfo: state => state.userState.userInfo
    })
  },
  methods: {
    ...mapMutations({
      setSelectedMarkerData: 'setSelectedMarkerData'
    }),
    ...mapActions({
      updateMissionData: 'checkPictureConvert',
    }),
    getMissionData () {
      this.name = this.missionData.name
      this.floor = this.missionData.floor
      this.inspector = this.userInfo.name
      this.selectedInspector = this.missionData.inspector
      this.accompany = this.missionData.accompany
      this.date = this.missionData.date
      this.category = this.missionData.category
      this.selfCheckState = this.missionData.selfCheckState
      this.status = this.missionData.status
      this.problem = this.missionData.problem
    },
    isAdminGroup () {
      this.isAdmin = (this.userInfo.group === 'admin') ? true : false
    },
    updateMission () {
      if (this.inspector !== this.selectedInspector) {
        this.textError = '查驗人員錯誤'
      } else if (this.selectedInspector !== '尚未查驗' && this.date === '') {
        this.textError = '請輸入日期'
      } else {
        let newMissionData = {
          accompany: this.accompany,
          category: this.category,
          date: this.date,
          inspector: this.inspector,
          problem: this.problem,
          selfCheckState: this.selfCheckState,
          status: this.status
        }
        this.updateMissionData()
        this.setSelectedMarkerData(newMissionData)
      }
    }
  },
  created () {
    // this.isAdminGroup()
  },
  mounted () {
    this.getMissionData()
  }
}
</script>

<style lang="sass" scoped>
.form
  width: 50%
  margin: auto

  @include ae1100
    width: 65%
  @include ae768
    width: 80%
  @include ae480
    width: 100%

  &__result
    // width: 100%
    &__text
      margin: 0

.log
  &__problem
    height: 80px
</style>