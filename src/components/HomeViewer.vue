<template>
  <div class="viewer">
    <iframe frameborder="0" id="viewerIframe"
      :src="viewerSrc"
      ref="iframe"
      ></iframe>
    <button @click="toggleDisplay">隔離</button>
    <button @click="createNewSnapshotAndMarker">建新視點</button>

    <NewMarker v-if="isAddingNewMarker" class="view__new-mark-form"
      @hideNewMarkForm="hideNewMarkForm" />
  </div>
</template>

<script>
import BIM from '../config/bimviewer'
import { markersDB } from '../config/db'
import { mapState } from 'vuex'
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
      isAddingNewMarker: false
      // toggleDisplayModeFlag: false
    }
  },
  computed: {
    ...mapState({
      modelPath: state => state.modelState.modelPath,
      modelName: state => state.modelState.modelName,
    }),
    viewerSrc () {
      return this.viewerServerHost + '/viewer.html?path=' + this.modelPath
    },
    iframeWindow () {
      return this.$refs.iframe.contentWindow
    }
  },
  methods: {
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
    createNewSnapshotAndMarker () {
      const vm = this
      let markers = []
      markersDB.collection(vm.modelName).get().then(docs => {
        docs.forEach(doc => {
          if (doc.id !== 'modelInfo') markers.push(doc.id)
        })
      }).then(() => {
        // 移除 markers 後才擷取視點
        BIM.removeMarker(markers)
        BIM.createSnapshotCallback()
        vm.revealNewMarkForm()
      })
    },
    hideNewMarkForm () {
      this.isAddingNewMarker = false
    },
    revealNewMarkForm () {
      this.isAddingNewMarker = true
    },
  },
  watch: {
    modelPath () {
      this.setupViewer()
    }
  },
  created () {
    const vm = this

    window.addEventListener('message', (e) => {
      if (e.origin !== vm.viewerServerHost) return
      let dataObj = (typeof e.data === 'object') ? e.data : JSON.parse(e.data)
      switch (dataObj.type) {
        // 回傳模型範圍 bbox
        case 'MSG_MODEL_READY':{
          // console.log(dataObj.data)
          break
        }
        // 無回傳值
        case 'MSG_MODEL_TREE_READY':{
          // console.log('tree ready')
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
    }, false)
  },
  mounted () {
    this.setupViewer()
  }
}
</script>

<style lang="scss" scoped>
.viewer {
  position: relative;
  overflow: hidden;
}

#viewerIframe {
  width: 100%;
  height: 50vh;

  @include ae768 {
    height: 40vh;
  }
}
</style>