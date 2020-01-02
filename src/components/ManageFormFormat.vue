<template>
  <div class="manageForm">
    <div class="manageForm__header">
      <h3>表格格式管理</h3>

      <label class="manageForm__header__btn btn btn__square" for="uploadForm">新增</label>
      <input type="file" accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" id="uploadForm" @change="getFile">
    </div>


    <p v-if="allFormFormat.length === 0">讀取資料中，請稍候</p>
    <div class="manageForm__table" v-else>
      <ul class="manageForm__table__sidebar">
        <li class="list__item"
          v-for="(form, i) in allFormFormat" :key="i+1"
          @click="selectFormFormat(i)">
          表格{{ i+1 }}. {{ allFormName[i] }}
        </li>
      </ul>

      <section class="manageForm__table__content list">
        <p class="v">{{ selectedFormName }}</p>

        <ul class=""
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
        </ul>
      </section>

    </div>

  </div>
</template>

<script>
import { format } from 'date-fns'
import XLSX from 'xlsx'
import { db } from '../config/db'

export default {
  name: 'ManageFormFormat',
  data () {
    return {
      allFormName: [],
      allFormFormat: [],
      selectedFormName: '',
      selectedFormFormat: undefined
    }
  },
  methods: {
    createNewId () {
      const date = format(new Date(), 'yyyyMMdd')
      const time = format(new Date(), 'HH:mm:ss')
      const stamp = new Date().valueOf()
      return `${date}-${time}-${stamp}`
    },
    getFile (e) {
      const vm = this
      const file = e.target.files[0]
      const fileReader = new FileReader()

      fileReader.onload = function (ev) {
        const data = ev.target.result
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
      }
      fileReader.readAsBinaryString(file)
    },
    // 取得表格格式
    getFormFormat () {
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
          this.allFormName.push(data.formName)
        })
      })
    },
    selectFormFormat (i) {
      this.selectedFormName = this.allFormName[i]
      this.selectedFormFormat = this.allFormFormat[i]
    },
    // 上傳新樣式
    uploadFormFormatToDB (formFormat) {
      // console.log(formFormat)
      const newId = this.createNewId()
      return db.collection('formFormat').doc(newId).set(formFormat)
      .then(() => {
        console.log('上傳表單格式成功')
      }).catch(err => console.log(err))
    }
  },
  created () {
    this.getFormFormat()
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
      position: absolute;
      left: 0;
      top: 0;
      display: inline-block;
      cursor: pointer;
    }
  }

  &__table {
    display: flex;
    &__sidebar {
      flex: 1;
    }
    &__content {
      flex: 3;
    }
  }
}
</style>