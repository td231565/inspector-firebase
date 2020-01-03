<template>
  <div class="manageModels">
    <div class="manageModels__header">
      <h3>模型管理</h3>
      <button class="manageModels__header__btn btn btn__square" @click="revealAddingForm">新增</button>
    </div>

    <!-- 新增模型資訊 -->
    <div class="manageModels__addnew" v-if="isAddingNewModelInfo">
      <ul class="form">
        <li>
          <h3>新增模型</h3>
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
          <input class="form__items__cells" v-model="modelPath" />
        </li>
        <li class="form__items flex--center">
          <button class="btn btn__square btn__square--success" @click="uploadModelToDB">上傳</button>
          <button class="btn btn__square" @click="hideAddingForm">取消</button>
        </li>
      </ul>
    </div>

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

export default {
  name: 'manageModel',
  data () {
    return {
      isAddingNewModelInfo: false,
      modelList: ['讀取中，請稍等'],
      modelName: '',
      modelFloor: '',
      modelPath: '',
      selectModel: undefined
    }
  },
  methods: {
    /* 模型管理 */
    uploadModelToDB () {
      // console.log(formFormat)
      let name = this.modelName
      let floor = this.modelFloor
      let url = this.modelPath
      this.modelList.push(name)

      // 加入模型資訊
      db.collection('markersData').doc('gugci_d')
      .collection(name).doc('modelInfo').set({
        modelFloor: floor,
        modelName: name,
        modelPath: url
      }).then(() => console.log('good'))
      .catch(err => console.log(err))

      // 加入模型清單
      db.collection('markersData').doc('gugci_d').update({
        models: this.modelList
      }).then(() => console.log('good'))
      .catch(err => console.log(err))
    },
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
  &__addnew {
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
  &__table {
    text-align: left;
  }
}
</style>