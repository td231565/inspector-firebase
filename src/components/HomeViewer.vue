<template>
  <div class="viewer">

    <NewMarker v-if="isShowNewMarkerForm"
      :viewerServerHost="viewerServerHost"
      :image="capturedSnapImage"
      :status="capturedSnapStatus"
      @hideNewMarkForm="hideNewMarkForm"
      @setNewMarker="setNewMarker" />

    <iframe frameborder="0" id="viewerIframe"
      :src="viewerSrc"
      ref="iframe"
      v-if="!selectedMarkerData"
      ></iframe>
    <!-- <button @click="toggleDisplay">隔離</button>
    <button @click="createNewSnapshotAndMarker">建新視點</button> -->

    <section class="viewer__image-block" v-else>
      <img class="viewer__image-block__image" :src="selectedMarkerData.image" alt="目標查驗點擷取畫面">
    </section>
  </div>
</template>

<script>
import BIM from '../config/bimviewer'
import { format } from 'date-fns'
import { markersDB } from '../config/db'
import { mapState, mapMutations, mapActions } from 'vuex'
import NewMarker from '../components/ViewerNewMarker'

export default {
  name: 'viewer',
  components: {
    NewMarker
  },
  data () {
    return {
      viewerServerHost: 'https://viewer.ctc.com.tw',
      // modelPath: 'dxbim/c1dc089c88dd4185a5d5b68ec1dfcfd5/1b5aaf8838dc4b3b9c0f424300eaf252/338b9ec428874dff9ae85f0a3426f47a.rvt',
      selectionId: '',
      selectionBBox: [],
      capturedSnapImage: undefined,
      capturedSnapStatus: undefined,
      isShowNewMarkerForm: false
    }
  },
  computed: {
    ...mapState({
      modelPath: state => state.modelState.modelPath,
      modelName: state => state.modelState.modelName,
      selectedMarkerData: state => state.modelState.selectedMarkerData,
      markerList: state => state.modelState.markerList,
      isAddNewMarker: state => state.systemState.isAddNewMarker,
    }),
    viewerSrc () {
      return this.viewerServerHost + '/viewer.html?path=' + this.modelPath
    },
    iframeWindow () {
      return this.$refs.iframe.contentWindow
    }
  },
  methods: {
    ...mapMutations({
      addingNewMarker: 'addingNewMarker',
      setSelectedMarkerData: 'setSelectedMarkerData',
      setLoading: 'setLoading'
    }),
    ...mapActions({
      getMarkerList: 'getMarkerList'
    }),
    setupViewer () {
      let modelData = {
        viewerServerHost: this.viewerServerHost,
        modelPath: this.modelPath,
        iframeWindow: this.$refs.iframe.contentWindow
      }
      BIM.initialize(modelData)
    },
    toggleDisplay () {
      BIM.toggleDisplayMode.switch()
    },
    createMarkers () {
      // if (!this.markerList) return
      this.markerList.map(item => BIM.createMarkers(item))
    },
    createNewSnapshotAndMarker () {
      const vm = this
      let markers = []
      markersDB.collection(vm.modelName).get().then(docs => {
        docs.forEach(doc => {
          if (doc.id !== 'modelInfo') markers.push(doc.id)
        })
      }).then(() => {
        // 1. 移除 markers
        BIM.removeMarker(markers)
        // 2. 擷取視點
        BIM.createSnapshotCallback()
        vm.revealNewMarkForm()
      })
    },
    selectMarkerFromViewer (id) {
      this.markerList.filter(item => {
        if (item.id === id) {
          this.setSelectedMarkerData(item)
          this.$emit('stepNext')
        }
      })
    },
    hideNewMarkForm () {
      this.isShowNewMarkerForm = false
      this.addingNewMarker(false)
    },
    revealNewMarkForm () {
      this.isShowNewMarkerForm = true
    },
    createNewId () {
      const date = format(new Date(), 'yyyyMMdd')
      const time = format(new Date(), 'HH:mm:ss')
      const stamp = new Date().valueOf()
      return `${date}-${time}-${stamp}`
    },
    setNewMarker (infoData) {
      this.setLoading(true)
      let newId = this.createNewId()
      const vm = this

      infoData['id'] = newId
      markersDB.collection(vm.modelName).doc(newId).set(infoData).then(() => {
        console.log('新視點建立成功')
        vm.setLoading(false)
        vm.getMarkerList()
        vm.setSelectedMarkerData(infoData)
        vm.$emit('stepNext')
      })
    },
    viewerMessageHandler (e) {
      const vm = this
      if (e.origin !== vm.viewerServerHost) return

      let dataObj = (typeof e.data === 'object') ? e.data : JSON.parse(e.data)
      switch (dataObj.type) {
        // 回傳模型範圍 bbox
        case 'MSG_MODEL_READY':{
          // console.log(dataObj.data)
          vm.setupViewer() // 每次回初始視點要重新定義 Viewer
          break
        }
        // 無回傳值
        case 'MSG_MODEL_TREE_READY':{
          // console.log('tree ready')
          vm.createMarkers()
          break
        }
        // 回傳選取物件 id、bbox
        case 'MSG_ENTITY_SELECTED': {
          // console.log(dataObj.data)
          let selectedData = dataObj.data
          BIM.viewerSelectionChangeHandler(selectedData)
          break
        }
        // 回傳選取物件屬性
        case 'MSG_RETURN_GET_INHERENT_PROPERTY': {
          // console.log(dataObj.data)
          break
        }
        // 回傳模型座標
        case 'MSG_RETURN_PICKED_POINT': {
          // console.log(dataObj.data)
          break
        }
        // 回傳選取 marker id
        case 'MSG_MARKER_SELECTED': {
          // console.log(dataObj.data)
          vm.selectMarkerFromViewer(dataObj.data.id)
          break
        }
        // 回傳擷取視點的視點資訊及畫面截圖
        case 'MSG_SNAPSHOT_CAPTURED': {
          // console.log(dataObj.data)
          vm.capturedSnapImage = dataObj.data.image
          vm.capturedSnapStatus = dataObj.data.status
          break
        }
      }
    }
  },
  watch: {
    modelPath () {
      this.setupViewer()
    },
    isAddNewMarker (val) {
      if (val) this.createNewSnapshotAndMarker()
    },
    markerList () {
      // 原本在 MODEL_READY 時呼叫
      // 但第一次載入時，markList 還沒從 DB 載入，因此等載入後再呼叫
      this.createMarkers()
    }
  },
  created () {
    /* 監聽 BIM viewer 回傳資訊 */
    window.addEventListener('message', this.viewerMessageHandler, false)
  },
  mounted () {
    this.setupViewer()
  },
  beforeDestroy () {
    window.removeEventListener('message', this.viewerMessageHandler, false)
  }
}
</script>

<style lang="scss" scoped>
.viewer {
  position: relative;
  overflow: hidden;
  &__image-block {
    width: 100%;
    height: 50vh;
    overflow: auto;
    @include ae768 {
      // height: 45vh;
      height: auto;
    }
    // @include ae480 {
    //   height: 40vh;
    // }
    &__image {
      // width: 100%;
      height: 100%;
      margin: auto;
      display: block;
      @include ae768 {
        width: 100%;
        height: auto;
      }
    }
  }
}

#viewerIframe {
  width: 100%;
  height: 50vh;
  display: block;

  @include ae768 {
    // width: 100%;
    height: 40vh;
  }
}
</style>