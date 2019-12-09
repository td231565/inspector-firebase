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
      <li class="form__items" v-if="userInfo">
        <label class="form__items__title">查驗人員</label>
        <select class="form__items__cells" v-model="selectedInspector">
          <option>尚未查驗</option>
          <option>{{ inspector }}</option>
        </select>
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
          <p class="form__result__text form__result__text--danger" v-if="errorText">{{ errorText }}</p>
          <p class="form__result__text form__result__text--normal" v-if="snedText">{{ snedText }}</p>
        </div>
        <button type="button" class="btn btn__square btn__square--success" @click="updateMission" v-if="userInfo">送出表單</button>
        <button type="button" class="btn btn__square btn__square--danger" v-if="isAdmin" @click="deleteMission">刪除表單</button>
      </li>
    </ul>
    <PopWarning v-if="isDeleteMission" @revealWarning="revealWarning" @stepToFirst="stepToFirst"/>
  </section>
</template>

<script>
import { format } from 'date-fns'
import { mapState, mapActions, mapMutations } from 'vuex'
import PopWarning from './FormWarning'

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
      isDeleteMission: false
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
      updateMissionData: 'checkPictureConvert',
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
    updateMission () {
      this.setErrorTextContent('')

      let currentUserName = this.userInfo.name

      if (currentUserName !== this.selectedInspector) {
        this.setErrorTextContent('查驗人員需為本人')
      } else if (!this.date) {
        this.setErrorTextContent('請輸入日期')
      } else if (!this.category) {
        this.setErrorTextContent('請選擇查驗類型')
      } else if (!this.selfCheckState) {
        this.setErrorTextContent('請確認自主檢查紀錄是否提送')
      } else if (!this.status) {
        this.setErrorTextContent('請確認圖說與模型是否一致')
      } else if (!this.problem) {
        this.setErrorTextContent('請輸入檢核結果說明')
      } else {
        let newMissionData = {
          accompany: this.accompany || '',
          category: this.category,
          date: this.date,
          inspector: this.selectedInspector,
          problem: this.problem,
          selfCheckState: this.selfCheckState,
          status: this.status,
          id: this.missionData.id
        }
        this.setSendTextContent('上傳中... ')
        this.setSelectedMarkerData(newMissionData)
        this.updateMissionData()
      }
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

  &__result
    // width: 100%
    &__text
      margin: 0
      font-size: 0.8rem
      &--danger
        color: $text_warning
      &--normal
        color: $text_success

.log
  &__problem
    height: 80px
</style>