<template>
  <div class="manageModels">
    <div class="manageModels__header">
      <h3>模型管理</h3>
      <button class="manageModels__header__btn btn btn__square" @click="revealAddingForm">新增</button>
    </div>

    <!-- 新增模型資訊 -->
    <UploadModel  v-if="isAddingNewModelInfo"
      :modelList="modelList"
      @hideAddingForm="hideAddingForm" />

    <!-- 模型列表 -->
    <ul class="manageModels__table list">
      <li class="manageModels__table__item list__item"
        v-for="(model, i) in modelList" :key="i+1"
        @click="selectModelFromDB(model)">
        {{ i+1 }}. {{ model }}

        <!-- 選取模型詳細資訊 -->
        <ul class="manageModels__table__item-info" v-if="!!selectModel && selectModel.id === model">
          <li class="form__items">
            <label class="form__items__title">模型名稱</label>
            <input class="form__items__cells" v-model="selectModel.modelName" disabled />
          </li>
          <li class="form__items">
            <label class="form__items__title">模型樓層</label>
            <input class="form__items__cells" v-model="selectModel.modelFloor" disabled />
          </li>
          <li class="form__items">
            <label class="form__items__title">模型路徑</label>
            <input class="form__items__cells" v-model="selectModel.modelPath" disabled />
          </li>
        </ul>

      </li>
    </ul>

  </div>
</template>

<script>
import { db } from '../config/db'
import UploadModel from './ManageUploadModel'

export default {
  name: 'manageModel',
  components: {
    UploadModel
  },
  data () {
    return {
      isAddingNewModelInfo: false,
      modelList: ['讀取中，請稍等'],
      selectModel: undefined
    }
  },
  methods: {
    /* 模型管理 */
    // 取得模型名稱列表
    getModelListFromDB () {
      db.collection('markersData').doc('gugci_d').get()
      .then(doc => {
        this.modelList = doc.data().models
      }).catch(err => console.log(err))
    },
    // 選擇模型
    selectModelFromDB (name) {
      db.collection('markersData').doc('gugci_d')
      .collection(name).doc('modelInfo').get()
      .then(doc => {
        this.selectModel = doc.data()
        this.selectModel['id'] = name
      })
    },
    // 新增模型資訊
    revealAddingForm () {
      this.isAddingNewModelInfo = true
    },
    hideAddingForm () {
      this.getModelListFromDB()
      this.isAddingNewModelInfo = false
    }
    // deleteModelFromDB () {
    //   db.collection('markersData').doc('gugci_d').get()
    //   .then(doc => {
    //     this.modelList = doc.data().models
    //   }).catch(err => console.log(err))
    // },
  },
  created () {
    this.getModelListFromDB()
  }
}
</script>

<style lang="scss" scoped>
.manageModels {
  &__header {
    position: relative;
    &__btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  &__table {
    text-align: left;
  }
}
</style>