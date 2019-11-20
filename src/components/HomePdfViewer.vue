<template>
  <div class="pdfviewer">
    <img class="pdfviewer__img" :src="img" alt="" v-show="isPdfLoaded">
    <pdf class="pdfviewer__pdf" :src="sourcePath" ref="pdf" v-show="!isPdfLoaded"></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { mapState } from 'vuex'

export default {
  name: 'HomePdfViewer',
  components: {
    pdf
  },
  data () {
    return {
      // sourcePath: 'https://firebasestorage.googleapis.com/v0/b/sme-markers-data-demo.appspot.com/o/test_plan_C.pdf?alt=media&token=8b074837-e93b-4cc2-8a3e-0a6dadc8e9aa',
      mark: null,
      isPdfLoaded: false,
      img: ''
    }
  },
  computed: {
    ...mapState({
      sourcePath: state => state.modelState.modelPath
    })
  },
  methods: {
    pageLoaded () {
      this.img = document.querySelector('canvas').toDataURL()
      this.isPdfLoaded = true
      this.$emit('pdfLoaded')
    }
  },
  mounted () {
    let vm = this
    pdf.createLoadingTask(this.sourcePath).then(() => {
      // console.log(data.numPages)
      vm.pageLoaded()
      // TODO: 載入 PDF 完成，轉成圖片
    })
  }
}
</script>

<style lang="sass" scoped>
.pdfviewer
  max-height: 45vh
  overflow: auto
  &__pdf
    width: 100%
    // max-height: 45vh

    @include ae768
      max-height: 40vh
  &__img
    width: 100%
</style>