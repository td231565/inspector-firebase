<template>
  <div class="pdfviewer">
    <img class="pdfviewer__img" :src="img" alt="" v-if="isPdfLoaded && stepNow === 1">
    <!-- <img class="pdfviewer__img" :src="selectedMarkerImage" alt="" v-else-if="isPdfLoaded && stepNow !== 1"> -->
    <pdf class="pdfviewer__pdf" :src="modelPath" ref="pdf" v-show="!isPdfLoaded"></pdf>
    <AddNewMarker v-if="isAddNewMarker"
      @finishAddingMarker="finishAddingMarker" />
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import AddNewMarker from './MissionNewMarker'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'HomePdfViewer',
  components: {
    pdf,
    AddNewMarker
  },
  props: {
    stepNow: Number,
    isAddNewMarker: Boolean
  },
  data () {
    return {
      // markerList: [],
      isPdfLoaded: false,
      img: ''
    }
  },
  computed: {
    ...mapState({
      modelPath: state => state.modelState.modelPath,
      selectedMarkerImage: state => state.modelState.selectedMarkerImage
    })
  },
  methods: {
    ...mapMutations({
      setselectedMarkerImage: 'setselectedMarkerImage'
    }),
    pageLoaded () {
      this.img = document.querySelector('canvas').toDataURL()
      this.setselectedMarkerImage(this.img)
      this.isPdfLoaded = true
      this.$emit('pdfLoaded')
    },
    finishAddingMarker () {
      this.$emit('finishAddingMarker')
    }
  },
  mounted () {
    let vm = this
    pdf.createLoadingTask(this.modelPath).then(() => {
      // console.log(data.numPages)
      vm.pageLoaded()
    })
  }
}
</script>

<style lang="sass" scoped>
.pdfviewer
  max-height: 45vh
  position: relative
  overflow: auto
  &__pdf
    width: 100%
    // max-height: 45vh

    @include ae768
      max-height: 40vh
  &__img
    width: 100%
</style>