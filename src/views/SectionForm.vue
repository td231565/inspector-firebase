<template>
  <section class="home__bottom__section home__bottom__section__form">
    <h3>步驟4：建立 BIM 自主查驗表</h3>
    <form @submit.prevent="updateMission">

      <ul class="form">
        <li class="form__items">
          <label class="form__items__title">視點名稱</label>
          <input class="form__items__cells" type="text" v-model="name" disabled />
        </li>
        <li class="form__items">
          <label class="form__items__title">樓層位置</label>
          <input class="form__items__cells" type="text" v-model="floor" disabled />
        </li>
        <li class="form__items" v-if="userInfo">
          <label class="form__items__title">查驗人員</label>
          <select class="form__items__cells" v-model="selectedInspector" required @blur="checkValid">
            <option>尚未查驗</option>
            <option>{{ inspector }}</option>
          </select>
          <p class="hint" v-if="!inspectorIsValid"><img src="../assets/shock.png">查驗人員需為本人。</p>
        </li>
        <li class="form__items" v-else>
          <label class="form__items__title">查驗人員</label>
          <input class="form__items__cells" type="text" v-model="selectedInspector" disabled />
        </li>
        <li class="form__items">
          <label class="form__items__title">隨行人員</label>
          <input class="form__items__cells" type="text" v-model="accompany" placeholder="以半形逗號區隔" />
        </li>
        <li class="form__items">
          <label class="form__items__title">查驗日期</label>
          <input class="form__items__cells" type="date" v-model="date" placeholder="yyyy-mm-dd" required />
        </li>
        <li class="form__items">
          <label class="form__items__title">查驗類型</label>
          <select class="form__items__cells" v-model="category" required>
            <option value="建築">建築</option>
            <option value="結構">結構</option>
            <option value="MEP">MEP</option>
            <option value="ICT">ICT</option>
          </select>
        </li>
        <li class="form__items">
          <label class="form__items__title">自主檢查紀錄是否提送</label>
          <select class="form__items__cells" v-model="selfCheckState" required>
            <option value="符合">符合</option>
            <option value="不符合">不符合</option>
          </select>
        </li>
        <li class="form__items">
          <label class="form__items__title">圖說與模型是否一致</label>
          <select class="form__items__cells" v-model="status" required>
            <option value="符合">符合</option>
            <option value="不符合">不符合</option>
          </select>
        </li>
        <li class="form__items">
          <label class="form__items__title">檢核結果說明</label>
          <textarea class="form__items__cells log__problem" v-model="problem" required></textarea>
        </li>
        <li class="form__items form__items__footer flex--right">
          <div class="form__result flex--center">
            <p class="form__result__text form__result__text--danger" v-if="errorText">{{ errorText }}</p>
            <p class="form__result__text form__result__text--normal" v-if="snedText">{{ snedText }}</p>
          </div>
          <button type="submit" class="btn btn__square btn__square--success" v-if="userInfo">送出表單</button>
          <button type="button" class="btn btn__square btn__square--danger" v-if="isAdmin" @click="deleteMission">刪除表單</button>
        </li>
      </ul>
    </form>

    <PopWarning v-if="isDeleteMission" @revealWarning="revealWarning" @stepToFirst="stepToFirst"/>

  </section>
</template>

<script>
import { format } from 'date-fns'
import { mapState, mapActions, mapMutations } from 'vuex'
import PopWarning from '../components/FormWarning'
import InternetConnection from '../config/connection'
import { addMissionToQuene } from '../config/uploadQuene'

export default {
  name: 'SectionForm',
  components: {
    PopWarning
  },
  data () {
    return {
      name: '名稱',
      floor: '樓層',
      // inspector: '',
      selectedInspector: '尚未查驗',
      accompany: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'MEP',
      selfCheckState: '符合',
      status: '符合',
      problem: 'OK',
      isUploadSuccess: null,
      isAdmin: false,
      errorText: '',
      snedText: '',
      isDeleteMission: false,
      inspectorIsValid: true
    }
  },
  computed: {
    ...mapState({
      missionData: state => state.modelState.selectedMarkerData,
      userInfo: state => state.userState.userInfo,
      isMarkerUpdated: state => state.modelState.isMarkerUpdated,
    }),
    inspector () {
      let name = ''
      if (this.userInfo) name = this.userInfo.name
      return name
    }
  },
  methods: {
    ...mapMutations({
      setSelectedMarkerData: 'setSelectedMarkerData',
      setMarkerUpdated: 'setMarkerUpdated'
    }),
    ...mapActions({
      updateMissionData: 'updateFromQueneToDB',
    }),
    getMissionData () {
      this.name = this.missionData.name
      this.floor = this.missionData.floor
      this.selectedInspector = this.missionData.inspector
      this.accompany = this.missionData.accompany
      this.date = this.missionData.date
      this.category = this.missionData.category
      this.selfCheckState = this.missionData.selfCheckState
      this.status = this.missionData.status
      this.problem = this.missionData.problem
    },
    isAdminGroup () {
      let userInfo = this.userInfo
      if (!userInfo) return
      this.isAdmin = (userInfo.group === 'admin') ? true : false
    },
    setSendTextContent (content) {
      this.snedText = content
    },
    setErrorTextContent (content) {
      this.errorText = content
    },
    checkInternetConnection (data) {
      addMissionToQuene(data)
      this.$emit('addMissionToQuene')

      let icStatus = InternetConnection()
      icStatus
      ? this.setSendTextContent('上傳中... ')
      : this.setErrorTextContent('網路訊號不佳，變更已存入等待清單')
    },
    checkValid () {
      this.inspectorIsValid = (this.selectedInspector !== this.userInfo.name) ? false : true
      return this.inspectorIsValid
    },
    updateMission () {
      this.setErrorTextContent('')

      const formIsValid = this.checkValid()
      if (!formIsValid) return

      let data = this.missionData

      data = Object.assign(data, {
        accompany: this.accompany || '',
        category: this.category,
        date: this.date,
        inspector: this.selectedInspector,
        problem: this.problem,
        selfCheckState: this.selfCheckState,
        status: this.status
      })

      this.checkInternetConnection(data)
    },
    deleteMission () {
      this.isDeleteMission = true
    },
    revealWarning (errMsg) {
      this.isDeleteMission = false
      if (errMsg) this.setErrorTextContent(errMsg)
    },
    stepToFirst () {
      this.$emit('stepToFirst')
    }
  },
  watch: {
    isMarkerUpdated (value) {
      if (value === true) {
        this.setSendTextContent('上傳成功！')
        // 跳回第一頁
        this.setMarkerUpdated(null)
        this.$emit('stepToFirst')
      } else if (value === false) {
        this.setSendTextContent('上傳失敗')
      }
    }
  },
  created () {
    this.isAdminGroup()
  },
  mounted () {
    this.getMissionData()
  },
  destroyed () {
    this.setSendTextContent('')
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

  &__items
    position: relative
  &__result
    // width: 100%
    &__text
      margin: 0
      font-size: 0.8rem
      &--danger
        color: $text_warning
      &--normal
        color: $text_success

.hint
  margin: 0
  padding: 0.6rem
  display: flex
  align-items: center
  position: absolute
  bottom: -2.8rem
  right: 25%
  font-size: 0.8rem
  background-color: #fff
  border: 1px solid #808080
  border-radius: 4px
  box-shadow: 3px 3px 6px rgba(#000, 0.2)
  z-index: 9
  > img
    width: 1.6rem
    height: 1.6rem
    margin-right: 0.4rem

.log
  &__problem
    height: 80px
</style>