<template>
  <div class="manage">
    <label for="uploadForm">上傳表格格式</label>
    <input type="file" name="" id="uploadForm" @change="getFile">
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { db } from '../config/db'

export default {
  name: 'manage',
  data () {
    return {
      newFormFormat: [],
      newFormName: undefined
    }
  },
  methods: {
    getFile (e) {
      const vm = this
      const file = e.target.files[0]
      const fileReader = new FileReader()

      fileReader.onload = function (ev) {
        try {
          const data = ev.target.result
          let workbook = XLSX.read(data, {
            type: 'binary' // 以二進制讀取 xls 檔案
          })
          let wbList = Object.keys(workbook.Sheets)

          for (let sheet in workbook.Sheets) {
            vm.newFormFormat = {}
            if (sheet === wbList[0]) {
              let result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
              result.map((item) => {
                vm.newFormFormat[item.name] = JSON.stringify(item)
              })
              console.log(result)
              console.log(vm.newFormFormat)
              vm.newFormName = result[0].name
              setTimeout(() => vm.uploadToDB(vm.newFormName, vm.newFormFormat), 1)
            } else {
              console.log('只讀取第一張工作表單')
            }
          }
        } catch (e) {
          console.log('檔案型別不正確')
          console.log(e)
          return
        }
      }
      fileReader.readAsBinaryString(file)
    },
    uploadToDB (formName, formFormat) {
      // let formName = this.newFormName
      // let formFormat = this.newFormFormat
      db.collection('formFormat').doc(formName).set(formFormat)
      .then(() => {
        console.log('good')
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style lang="sass" scoped>
.manage
  border: 1px solid red
</style>