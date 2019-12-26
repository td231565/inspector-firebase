<template>
  <div class="manage">
    <div class="manage__controls">
      <button class="btn btn__square btn__square--success" @click="backToHome">上一步</button>
    </div>

    <div class="manage__interface">
      <ManageFormFormat />
      <ManageModel />
    </div>

  </div>
</template>

<script>
import ManageModel from '../components/ManageModel'
import ManageFormFormat from '../components/ManageFormFormat'
import XLSX from 'xlsx'
import { db } from '../config/db'

export default {
  name: 'manage',
  components: {
    ManageModel,
    ManageFormFormat
  },
  data () {
    return {

    }
  },
  methods: {
    /* 表格管理 */
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
    },
    backToHome () {
      this.$emit('backToHome')
    }
  }
}
</script>

<style lang="scss" scoped>
.manage {
  &__interface {
    display: flex;
    > div {
      flex: 1;
      padding: 0 1rem;
      border: 1px solid green;
    }
  }
}
</style>