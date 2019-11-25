<template>
  <div class="pdfviewer">
    <div class="pdfviewer__imgLayer" v-if="isPdfLoaded && stepNow === 1">
      <img class="pdfviewer__imgLayer__img" :src="img" alt="">
      <div class="pdfviewer__imgLayer__markersLayer absolute--top">
        <MarkerItem v-for="(mark, index) in markersList" :key="index+1"
          :mark="mark" @stepNext="stepNext" />
      </div>
    </div>

    <img class="pdfviewer__imgLayer__img" :src="img" alt="" v-if="stepNow !== 1 && !selectedMarkerImage">
    <img class="pdfviewer__imgLayer__img" :src="selectedMarkerImage" alt="" v-if="stepNow !== 1 && !!selectedMarkerImage">

    <pdf class="pdfviewer__pdf" :src="modelPath" ref="pdf" v-show="!isPdfLoaded"></pdf>
    <AddNewMarker v-if="isAddNewMarker" @finishAddingMarker="finishAddingMarker" />
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import AddNewMarker from './MissionNewMarker'
import MarkerItem from './MarkersItem'
import { mapState, mapMutations } from 'vuex'
import { db } from '../config/db'

export default {
  name: 'HomePdfViewer',
  components: {
    pdf,
    AddNewMarker,
    MarkerItem
  },
  props: {
    stepNow: Number,
  },
  data () {
    return {
      isPdfLoaded: false,
      img: '',
      markersList: []
    }
  },
  computed: {
    ...mapState({
      modelName: state => state.modelState.modelName,
      modelPath: state => state.modelState.modelPath,
      selectedMarkerImage: state => state.modelState.selectedMarkerImage,
      isAddNewMarker: state => state.modelState.isAddNewMarker,
    })
  },
  methods: {
    ...mapMutations({
      setSelectedMarkerImage: 'setSelectedMarkerImage',
      addingNewMarker: 'addingNewMarker',
      setSelectedMarker: 'setSelectedMarker'
    }),
    pageLoaded () {
      this.img = document.querySelector('canvas').toDataURL()
      this.setSelectedMarkerImage(this.img)
      this.isPdfLoaded = true
      this.$emit('pdfLoaded')
    },
    getMarkersListFromDB () {
      let vm = this
      let modelName = vm.modelName

      db.collection('markersData').doc('gugci_d')
        .collection(modelName).onSnapshot(docs => {
          vm.markersList = []
          docs.forEach(doc => {
            if (doc.id === 'modelInfo') return
            let docData = doc.data()
            docData.id = doc.id
            vm.markersList.push(docData)
          })
        })
    },
    stepNext () {
      this.$emit('stepNext')
    },
    finishAddingMarker (id) {
      this.addingNewMarker(false)
      this.setSelectedMarker(id)
      this.stepNext()
    }
  },
  mounted () {
    let vm = this
    pdf.createLoadingTask(this.modelPath).then(() => {
      // console.log(data.numPages)
      vm.pageLoaded()
    })
    this.getMarkersListFromDB()
  }
}
</script>

<style lang="sass" scoped>
.pdfviewer
  max-height: 45vh
  position: relative
  overflow: auto
  z-index: -1
  &__pdf
    width: 100%
    // max-height: 45vh

    @include ae768
      max-height: 40vh
  &__imgLayer
    position: relative
    &__img
      width: 100%
    &__markersLayer
      width: 100%
      height: 100%
      background-color: rgba(orange, 0.1)
</style>