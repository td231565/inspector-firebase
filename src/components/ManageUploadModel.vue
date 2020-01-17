<template>
  <!-- 新增模型資訊 -->
  <div class="upload-new-model">
    <ul class="form">
      <li>
        <h3>新增模型</h3>
      </li>
      <li class="form__items">
        <label class="form__items__title" for="modelFile">上傳模型</label>
        <!-- <input id="modelFile" type="file" @change="uploadModelToFS" /> -->
        <div class="form__items__cells bg-white">
          {{ originName }}
          <input id="modelFile" type="file" @change="uploadModelToFS" v-if="!isUploaded" />
        </div>
      </li>
      <li class="form__items">
        <label class="form__items__title">模型名稱</label>
        <input class="form__items__cells" v-model="modelName" />
      </li>
      <li class="form__items">
        <label class="form__items__title">模型樓層</label>
        <input class="form__items__cells" v-model="modelFloor" />
      </li>
      <li class="form__items">
        <label class="form__items__title">模型路徑</label>
        <input class="form__items__cells" v-model="modelUrl" disabled />
      </li>
      <li class="form__items flex--center">
        <button class="btn btn__square btn__square--success" @click="updateModelInfoToDB">上傳</button>
        <button class="btn btn__square" @click="hideAddingForm">取消</button>
      </li>
    </ul>
  </div>
</template>

<script>
// import axios from 'axios'
import { format } from 'date-fns'
import { mapMutations } from 'vuex'
import { db } from '../config/db'

export default {
  name: 'upload-new-model',
  props: {
    modelList: Array
  },
  data () {
    return {
      originName: '',
      modelName: '',
      modelFloor: '',
      modelPath: '',
      modelUrl: '',
      isUploaded: false
    }
  },
  methods: {
    ...mapMutations({
      setLoading: 'setLoading'
    }),
    /* 模型管理 */
    updateModelInfoToDB () {
      // console.log(formFormat)
      this.setLoading(true)
      let vm = this
      let info = {
        modelFloor: this.modelFloor,
        modelName: this.modelName,
        modelPath: this.modelPath,
        modelUrl: this.modelUrl
      }
      vm.modelList.push(info.modelName)

      // 加入模型資訊
      db.collection('markersData').doc('gugci_d')
      .collection(info.modelName).doc('modelInfo')
      .set(info)
      .then(() => console.log('good'))
      .catch(err => console.log(err))

      // 加入模型清單
      db.collection('markersData').doc('gugci_d')
      .update({ models: vm.modelList })
      .then(() => {
        vm.hideAddingForm()
        vm.setLoading(false)
      })
      .catch(err => console.log(err))
    },
    uploadModelToFS (e) {
      let vm = this
      let file = e.target.files[0]
      if (!file) return

      this.setLoading(true)
      console.log(file)
      let date = format(new Date(), 'yyyyMMdd')
      let timestamp = new Date().valueOf()
      let name = file.name
      // let path = `modelsFromCheck3D/${date}_${name.split('.')[0]}_${timestamp}/${name}`
      let path = `${date}_${name.split('.')[0]}_${timestamp}/${name}`

      let formData = new FormData()
      formData.append('file', file)
      formData.append('path', path)
      formData.append('originFileName', name)

      // axios('http://192.168.1.83:14002/dx/api/f/v1/file/', {
      //   method: 'POST',
      //   header: new Headers({
      //     'Content-type': 'application/x-www-form-urlencoded'
      //   }),
      //   body: formData,
      // }).then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })

      fetch('http://192.168.1.83:14002/dx/api/f/v1/file/', {
        method: 'POST',
        body: formData,
        // 內容是 form-data 時，不用且不要設置 Content-Type
      }).then(res => {
        return (res.ok) ? res.json() : res.error
      }).then(res => {
        console.log('upload to fs success')
        console.log(res)
        vm.originName = name
        vm.modelPath = res.data.path
        vm.modelUrl = res.data.url + '&language=zh-TW'
        vm.isUploaded = true
        vm.setLoading(false)
      }).catch(err => console.log(err))
    },
    // 新增模型資訊
    hideAddingForm () {
      this.$emit('hideAddingForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-new-model {
  width: 100%;
  height: 100%;
  padding-top: 6rem;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  color: #fff;
  background-color: rgba(#000, 0.7);
  .form {
    width: 30%;
    &__items {
      &__title {
        width: 7rem;
        @include ae480 {
          width: 20%;
        }
      }
      &__cells {
        width: calc(100% - 7rem);
        @include ae480 {
          width: 80%;
        }
      }
      &:nth-last-child(1) {
        margin-top: 2rem;
      }
    }
    @include ae768 {
      width: 70%;
    }
    @include ae480 {
      width: 90%;
    }
  }
}

.bg-white {
  height: 1.6rem;
  text-align: left;
  color: #000;
  background-color: #fff;
  border: 1px solid $bd_input_default;
}
</style>