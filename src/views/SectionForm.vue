<template>
  <section class="home__bottom__section home__bottom__section__form">
    <h3>步驟4：建立 BIM 自主查驗表</h3>

    <div class="form-format-area" v-if="!inspector">
    <!-- <div class="form-format-area"> -->
      <ul>
        <li class="form-format-area__item"
          v-for="(form, i) in allFormFormat"
          :key="i+1"
          @click="selectFormFormat(form.formName)"
          >{{ form.formName }}
        </li>
      </ul>
    </div>

    <!-- 固定內容 -->
    <ul class="form">
      <li class="form__items">
        <label class="form__items__title">查驗項目</label>
        <input class="form__items__cells" name="查驗項目" type="text" v-model="name" disabled />
      </li>
      <li class="form__items">
        <label class="form__items__title">樓層位置</label>
        <input class="form__items__cells" name="樓層位置" type="text" v-model="floor" disabled />
      </li>
      <li class="form__items">
        <label class="form__items__title">建立人員</label>
        <input class="form__items__cells" name="建立人員" type="text" v-model="creator" disabled />
      </li>
      <li class="form__items">
        <label class="form__items__title">建立日期</label>
        <input class="form__items__cells" name="建立日期" type="date" v-model="createDate" disabled />
      </li>
    </ul>

    <form @submit.prevent="updateMission" ref="form">
      <ul class="form">
        <!-- 客製表格內容 -->
        <li class=""
          v-for="(column, i) in selectedFormFormat"
          :key="i+1">

          <!-- 下拉選單 -->
          <div class="form__items" v-if="column.type === 'select' && column.name !== '查驗人員'">
            <label class="form__items__title">{{ column.name }}</label>
            <select class="form__items__cells" :name="column.name" required>
              <option>請選擇</option>
              <option
                :type="column.type"
                v-for="(option, index) in JSON.parse(column.content)"
                :key="index+10"
                :value="option"
                :selected="option === column.value">
                {{ option }}
              </option>
            </select>
          </div>

          <div class="form__items" v-else-if="column.name === '查驗人員'">
            <label class="form__items__title">{{ column.name }}</label>
            <select class="form__items__cells" :name="column.name" required>
              <option>請選擇</option>
              <option>尚未查驗</option>
              <option v-if="!!column.value"
                :value="column.value"
                selected>{{ column.value }}</option>
              <option v-if="column.value !== userInfo.name"
                :value="userInfo.name">{{ userInfo.name }}</option>
            </select>
          </div>

          <!-- 多行文字 -->
          <div class="form__items" v-else-if="column.type === 'textarea'">
            <label class="form__items__title">{{ column.name }}</label>
            <textarea class="form__items__cells"
              :name="column.name" :value="column.value" required></textarea>
          </div>

          <!-- 單行文字 -->
          <div class="form__items" v-else-if="column.type === 'text'">
            <label class="form__items__title">{{ column.name }}</label>
            <input class="form__items__cells"
              :name="column.name" :type="column.type" :value="column.value" required />
          </div>

          <!-- 日期 -->
          <div class="form__items" v-else-if="column.type === 'date'">
            <label class="form__items__title">{{ column.name }}</label>
            <input class="form__items__cells"
              :name="column.name" :type="column.type" :value="column.value" required />
          </div>
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
import { db } from '../config/db'

export default {
  name: 'SectionForm',
  components: {
    PopWarning
  },
  data () {
    return {
      date: format(new Date(), 'yyyy-MM-dd'),
      isUploadSuccess: null,
      isAdmin: false,
      errorText: '',
      snedText: '',
      isDeleteMission: false,
      // inspectorIsValid: true,
      allFormFormat: [],
      selectedFormFormat: {}
    }
  },
  computed: {
    ...mapState({
      missionData: state => state.modelState.selectedMarkerData,
      userInfo: state => state.userState.userInfo,
      isMarkerUpdated: state => state.modelState.isMarkerUpdated,
    }),
    name () {
      return this.missionData[1].value
    },
    floor () {
      return this.missionData[2].value
    },
    creator () {
      return this.missionData[3].value
    },
    createDate () {
      return this.missionData[4].value
    },
    inspector () {
      let t = (this.missionData[5]) ? this.missionData[5].value : undefined
      return t
    }
  },
  methods: {
    ...mapMutations({
      setSelectedMarkerData: 'setSelectedMarkerData',
      setMarkerUpdated: 'setMarkerUpdated',
      setLoading: 'setLoading'
    }),
    ...mapActions({
      updateMissionData: 'updateFromQueneToDB',
    }),
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
    uploadDataToQuene () {
      this.setSendTextContent('上傳中... ')
      this.setLoading(true)
    },
    checkInternetConnection (data) {
      // console.log(1)
      addMissionToQuene(data)
      this.$emit('addMissionToQuene')
      // console.log(2)

      let icStatus = InternetConnection()
      icStatus
      // ? this.setSendTextContent('上傳中... ')
      ? this.uploadDataToQuene()
      : this.setErrorTextContent('網路訊號不佳，變更已存入等待清單')
    },
    // checkValid () {
    //   this.inspectorIsValid = (this.selectedInspector !== this.userInfo.name) ? false : true
    //   return this.inspectorIsValid
    // },
    updateMission (e) {
      let form = e.target.elements
      let formData = this.selectedFormFormat
      let data = this.missionData

      for (let i=0; i<form.length; i++) {
        if (form[i].name === '查驗人員') {
          if (form[i].value !== this.userInfo.name) {
            this.setErrorTextContent('查驗人員須為本人')
            return
          }
        }

        if (!form[i].name) break
        // 索引從5開始，才不會覆蓋資料庫中前面4項查驗點基礎資訊
        formData[i+5].value = form[i].value
        // console.log('name: ' + form[i].name + ' , value: ' + form[i].value)
      }

      data = Object.assign(data, formData)
      // console.log(data)

      this.setErrorTextContent('')
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
    },
    // 取得表格格式
    getFormFormat () {
      if (this.inspector) return
      db.collection('formFormat').get().then(docs => {
        docs.forEach(doc => {
          this.allFormFormat.push(doc.data())
        })
      })
    },
    selectFormFormat (formName) {
      this.allFormFormat.filter(item => {
        item.formName === formName ? this.selectedFormFormat = item : ''
      })
    },
    // 如果是已經填好的表單，資料從 missionData 抓
    // 還未填寫，則從 form列表 挑選表格樣式
    // 依'查驗人員'是否有值判斷
    getData () {
      if (!this.inspector) return

      let data = {}
      let formKeys = Object.keys(this.missionData).filter(k => parseInt(k).toString() !== 'NaN')
      formKeys.map(k => {
        if (k < 5) return
        data[k] = this.missionData[k]
      })
      // console.log(data)
      this.selectedFormFormat = data
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
    this.getData()
    this.getFormFormat()
  },
  mounted () {

  },
  destroyed () {
    this.setSendTextContent('')
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 50%;
  margin: auto;

  @include ae1100 {
    width: 70%;
  }
  @include ae768 {
    width: 80%;
  }
  // @include ae480 {
  //   width: 70%;
  // }

  &__items {
    position: relative;
    &__cells {
      display: flex;
    }
  }
  &__result {
    // width: 100%;
    &__text {
      margin: 0;
      font-size: 0.8rem;
      &--danger {
        color: $text_warning;
      }
      &--normal {
        color: $text_success;
      }
    }
  }
}

.form-format-area {
  margin: 1rem;
  display: flex;
  &__item {
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    border: 1px solid $bd_input_focus;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      background-color: rgba(#000, 0.1);
    }
  }
}

.hint {
  margin: 0;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: -2.8rem;
  right: 25%;
  font-size: 0.8rem;
  background-color: #fff;
  border: 1px solid #808080;
  border-radius: 4px;
  box-shadow: 3px 3px 6px rgba(#000, 0.2);
  z-index: 9;
  > img {
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.4rem;
  }
}

.log {
  &__problem {
    height: 80px;
  }
}
</style>