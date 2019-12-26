<template>
  <div class="managForm">
    <h3>表格格式管理</h3>
    <label class="managForm__upload" for="uploadForm">上傳表格格式</label>
    <input type="file" accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" id="uploadForm" @change="getFile">
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { db } from '../config/db'

export default {
  name: 'ManageFormFormat',
  data () {
    return {

    }
  },
  methods: {
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
            let format = Object.assign({}, {
              formName: firstRow.name
            })
            result.map((item, i) => {
              format[i+1] = item
            })
            console.log(result)
            setTimeout(() => vm.uploadFormFormatToDB(format), 1)
          } else {
            console.log('只讀取第一張工作表單')
          }
        }
      }
      fileReader.readAsBinaryString(file)
    },
    uploadFormFormatToDB (formFormat) {
      // console.log(formFormat)
      return db.collection('formFormat').add(formFormat)
      .then(() => {
        console.log('good')
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style lang="sass" scoped>
.managForm
  &__upload
    border: 1px solid blue
    cursor: pointer
</style>