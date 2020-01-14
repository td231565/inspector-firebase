<template>
  <div class="manageForm" @click="foldSidebar">
    <section class="manageForm__header">
      <h3>表格格式管理</h3>

      <label class="manageForm__header__btn btn btn__square" for="uploadForm">
        <span>新增</span>
        <p class="manageForm__header__btn__hint" v-if="isFormUpload !== undefined">{{ formUploadHint }}</p>
      </label>
      <input type="file"
        accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        id="uploadForm" @change="getFile">
    </section>


    <p v-if="allFormFormat.length === 0">讀取資料中，請稍候</p>
    <section class="manageForm__table" v-else>
      <ul class="manageForm__table__sidebar list" :class="{ visible: isSidebarVisible }" @click="changeSelectItemColor">
        <button class="manageForm__table__sidebar__switch btn btn__square"
          ref="sidebarSwitch"
          @click="toggleSidebar"
          v-if="isSmallScreen">{{ sidebarSwitchContent }}</button>
        <li class="list__item"
          v-for="(form, i) in allFormFormat" :key="i+1"
          @click="selectFormFormat(i)">
          表格{{ i+1 }}. {{ allFormObject[i].formName }}
        </li>
      </ul>

      <section class="manageForm__table__content list">
        <p class="">《 {{ selectedFormName }} 》</p>

        <FormFormat :selectedFormFormat="selectedFormFormat" />
        <!-- <ul class="form"
          v-for="(column, i) in selectedFormFormat"
          :key="i+1">
          <li class="form__items">
            <label class="form__items__title">{{ i }}. 欄位名稱</label>
            <input class="form__items__cells" v-model="column.name" disabled />
          </li>
          <li class="form__items">
            <label class="form__items__title">欄位形態</label>
            <input class="form__items__cells" v-model="column.type" disabled />
          </li>
          <li class="form__items">
            <label class="form__items__title">欄位值</label>
            <input class="form__items__cells" v-model="column.content" disabled />
          </li>
        </ul> -->

        <div class="manageForm__table__content__footer flex--right" v-if="selectedFormFormat">
          <button class="manageForm__table__content__footer__delete btn btn__square btn__square--danger"
            @click="revealWarning">刪除表格</button>
        </div>
      </section>

    </section>

    <PopWarning v-if="isDeleteFormat"
      @hideWarning="hideWarning"
      @doDelete="deleteFormFormat" />

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { format } from 'date-fns'
import XLSX from 'xlsx'
import { db } from '../config/db'
import FormFormat from '../components/FormFormat'
import PopWarning from '../components/PopWarning'

export default {
  name: 'ManageFormFormat',
  components: {
    FormFormat,
    PopWarning
  },
  data () {
    return {
      isSmallScreen: false,
      isSidebarVisible: false,
      isFormUpload: undefined,
      isDeleteFormat: false,
      // 所有樣式
      allFormObject: [],
      allFormFormat: [],
      // 選取的樣式
      selectedFormName: '',
      selectedFormFormat: undefined,
      selectedFormId: ''
    }
  },
  computed: {
    sidebarSwitchContent () {
      return this.isSidebarVisible ? '❮' : '❯'
    },
    formUploadHint () {
      let t = ''
      if (this.isFormUpload === true) {
        t = '上傳成功'
      } else if (this.isFormUpload === false) {
        t = '上傳失敗'
      }
      return t
    }
  },
  methods: {
    ...mapMutations({
      setLoading: 'setLoading'
    }),
    changeSelectItemColor (e) {
      if (!e.target.className.match('list__item')) return
      const target = e.target
      const list = e.target.parentNode
      list.querySelectorAll('li').forEach(item => item.classList.remove('selected'))
      target.classList.add('selected')
    },
    createNewId () {
      const date = format(new Date(), 'yyyyMMdd')
      const time = format(new Date(), 'HH:mm:ss')
      const stamp = new Date().valueOf()
      return `${date}-${time}-${stamp}`
    },
    parseXlsFile (data) {
      const vm = this

      let workbook = XLSX.read(data, {
        type: 'binary' // 以二進制讀取 xls 檔案
      })
      let wbList = Object.keys(workbook.Sheets)

      for (let sheet in workbook.Sheets) {
        vm.newFormFormat = {}
        if (sheet === wbList[0]) {
          let result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
          let firstRow = result[0]
          let format = { formName: firstRow.name }
          for (let i=0; i<result.length; i++) {
            if (i === 0) continue
            format[i+4] = result[i]
          }
          // console.log(result)
          setTimeout(() => vm.uploadFormFormatToDB(format), 1)
        }
        //  else {
        //   console.log('只讀取第一張工作表單')
        // }
      }
    },
    getFile (e) {
      const vm = this
      const file = e.target.files[0]
      const fileReader = new FileReader()

      fileReader.onload = function (ev) {
        const data = ev.target.result
        vm.parseXlsFile(data)
      }
      fileReader.readAsBinaryString(file)
    },
    // 取得表格格式
    getFormFormat () {
      this.allFormObject = []
      this.allFormFormat = []
      db.collection('formFormat').get().then(docs => {
        docs.forEach(doc => {
          let data = doc.data() // is Object
          let format = {}
          let formKeys = Object.keys(data).filter(k => parseInt(k).toString() !== 'NaN')
          formKeys.map((k, i) => {
            format[i+1] = data[k]
          })
          this.allFormFormat.push(format)
          this.allFormObject.push({
            id: doc.id,
            formName: data.formName
          })
        })
      })
    },
    selectFormFormat (i) {
      this.selectedFormName = this.allFormObject[i].formName
      this.selectedFormId = this.allFormObject[i].id
      this.selectedFormFormat = this.allFormFormat[i]
    },
    // 上傳新樣式
    uploadFormFormatToDB (formFormat) {
      // console.log(formFormat)
      const newId = this.createNewId()
      return db.collection('formFormat').doc(newId).set(formFormat)
      .then(() => {
        console.log('上傳表單格式成功')
        this.refreshUploadState(true)
        this.getFormFormat()
      }).catch(err => {
        console.log(err)
        this.refreshUploadState(false)
      })
    },
    // 刪除表格樣式
    deleteFormFormat () {
      const vm = this
      let selectedForm = vm.selectedFormId
      vm.hideWarning()

      db.collection('formFormat').doc(selectedForm).delete().then(() => {
        vm.getFormFormat()
        vm.setLoading(false)
      }).catch(err => {
        console.log(err.code)
        vm.setLoading(false)
      })
    },
    refreshUploadState (boolean) {
      this.isFormUpload = boolean
      setTimeout(() => this.isFormUpload = undefined, 5000)
    },
    // 偵測螢幕寬度
    detectDeviceWidth () {
      this.isSmallScreen = screen.width < 480
    },
    // 展開/收合 sidebar
    toggleSidebar () {
      this.isSidebarVisible = !this.isSidebarVisible
    },
    // 收合 sidebar
    foldSidebar (e) {
      if (!this.isSmallScreen && !this.isSidebarVisible) return
      if (e.target === this.$refs.sidebarSwitch) return
      this.isSidebarVisible = false
    },
    revealWarning () {
      this.isDeleteFormat = true
    },
    hideWarning () {
      this.isDeleteFormat = false
    }
  },
  created () {
    this.getFormFormat()
    this.detectDeviceWidth()
  }
}
</script>

<style lang="scss" scoped>
.manageForm {
  #uploadForm {
    width: 1px;
    height: 1px;
  }

  &__header {
    position: relative;
    &__btn {
      height: auto;
      position: absolute;
      left: 0;
      top: 0;
      display: inline-block;
      cursor: pointer;
      &__hint {
        width: 150%;
        margin: 0;
        position: absolute;
        top: 50%;
        left: 90%;
        transform: translateY(-50%);
      }
    }
  }

  &__table {
    display: flex;
    position: relative;
    &__sidebar {
      flex: 1;
      position: relative;
      &__switch {
        position: absolute;
        top: 50%;
        right: -1rem;
        transform: translateY(-50%);
      }
      @include ae480 {
        position: absolute;
        transform: translateX(-90%);
        transition: transform 0.3s ease;
        &.visible {
          transform: translateX(0);
          transition: transform 0.3s ease;
        }
      }
    }
    &__content {
      flex: 3;
      background-color: rgba(#fff, 0.7);
      &__footer {
        margin: 0.5rem 0 1rem 0;
        &__delete {
          @include ae768 {
            color: #fff;
            background-color: $bg_btn_danger;
            border-color: $bg_btn_danger;
          }
        }
      }
    }
  }
}

.list__item.selected {
  background-color: $bg_input_focus;
}

.form {
  width: 27rem;
  margin: auto;
  margin-bottom: 1rem;
  @include ae480 {
    width: 24rem;
  }

  &__items {
    &__title {
      width: 9rem;
    }
    &__cells {
      width: 18rem;
      @include ae480 {
        width: 14rem;
      }
    }
  }
}
</style>