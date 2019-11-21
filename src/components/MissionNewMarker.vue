<template>
  <div class="add absolute--top">
    <img :src="selectedMarkerImage" alt="平面圖">

    <div class="add__cover absolute--top" @click="addingNewMarker">
      <section class="add__section add__point" v-if="addStep === 1">
        <h4 class="add__section__header">點擊圖片位置新增查驗點</h4>
      </section>

      <section class="add__section add__form" v-else-if="addStep === 2">
        <NewMarkerForm @addMarkerInfo="addMarkerDataToDB" />
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { markersDB } from '../config/db'
import NewMarkerForm from './NewForm'

export default {
  name: 'AddNewMarker',
  components: {
    NewMarkerForm
  },
  data () {
    return {
      addStep: 1,
      position: null
    }
  },
  computed: {
    ...mapState({
      selectedMarkerImage: state => state.modelState.selectedMarkerImage,
      modelName: state => state.modelState.modelName
    })
  },
  methods: {
    addingNewMarker (e) {
      if (this.addStep !== 1) return
      this.position = {
        top: e.offsetY,
        left: e.offsetX
      }
      // this.$emit('addingNewMarker', position)
      this.addStep = 2
    },
    resetAddStep () {
      this.addStep = 1
    },
    addMarkerDataToDB (info) {
      info.point = [this.position.left, this.position.top]
      markersDB.collection(this.modelName).add(info)
      .then(() => {
        console.log('add marker success')
        this.$emit('finishAddingMarker')
      }).catch(err => {
        console.log(err.code)
      })
    },
    cancelAddNewMarker () {
      this.$emit('finishAddingMarker')
    }
  },
  beforeDestroy () {
    this.resetAddStep()
  }
}
</script>

<style lang="sass" scoped>
.add
  &__cover
    width: 100%
    height: 100%
    background-color: $bg_cover_layer
    box-shadow: inset 0 0 50px #000
  &__section
    &__header
      color: #fff

  &__point

</style>