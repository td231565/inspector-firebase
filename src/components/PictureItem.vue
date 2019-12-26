<template>
  <li class="photos__item">
    <div class="photos__item__block" @click="choosePhoto">
      <img class="photos__item__block__img absolute--center" :src="pictureImg" alt="">
      <button class="btn btn__delete" title="刪除圖片" @click="deletePicture"></button>
    </div>
    <div class="photos__item__text">
      <textarea class="photos__item__text__textarea" placeholder="請輸入抽查意見"
        v-model="pictureText" :disabled="!isEdit"></textarea>
      <div class="photos__item__text__control" @click="switchEdit">{{ controlStatus }}</div>
    </div>

    <PopFrame :photo="pictureImg" @closePop="unChoosePhoto" v-if="isChoosed" />
  </li>
</template>

<script>
import PopFrame from './PopFrame'

export default {
  name: 'PhotoItem',
  components: {
    PopFrame
  },
  props: {
    picture: Array,
    index: Number
  },
  data () {
    return {
      isChoosed: false,
      pictureText: '',
      pictureImg: '',
      isEdit: false,
    }
  },
  computed: {
    combinePhotoText () {
      return [this.pictureImg, this.pictureText]
    },
    controlStatus () {
      return (this.isEdit) ? 'done' : 'edit'
    }
  },
  methods: {
    parsePicture () {
      this.pictureImg = this.picture[0]
      this.pictureText = this.picture[1]
    },
    choosePhoto (e) {
      if (e.target.className.match('btn__delete')) return
      this.isChoosed = true
    },
    unChoosePhoto () {
      this.isChoosed = false
    },
    updatePhotoText () {
      let pictureData = {
        index: this.index,
        item: this.combinePhotoText
      }
      this.$emit('updatePhotoText', pictureData)
    },
    deletePicture () {
      let index = this.index
      this.$emit('deletePicture', index)
    },
    switchEdit () {
      this.isEdit = !this.isEdit
      if (!this.isEdit) this.updatePhotoText()
    }
  },
  watch: {
    picture () {
      // vuex中的list改變時，重讀url
      this.parsePicture()
    }
  },
  mounted () {
    this.parsePicture()
  }
}
</script>

<style lang="scss" scoped>
.photos {
  &__item {
    margin: 0 1%;
    &__block {
      img {
        max-width: 100%;
        display: block; // 消除 img 底部與 div 間的空白
      }
      .btn__delete {
        position: absolute;
        top: 5px;
        right: 5px;
      }
    }
    &__text {
      position: relative;
      &__textarea {
        width: 100%;
        height: 60px;
        margin-top: 8px;
        padding: 6px;
        border-radius: 10px;
      }
      &__control {
        position: absolute;
        bottom: 7px;
        right: 15px;
        cursor: pointer;
      }
    }
  }
}
</style>