<template>
  <div class="pdfviewer">
    <!-- <canvas class="pdfviewer__canvas" ref="canvas"></canvas> -->
    <pdf class="pdfviewer__pdf" :src="sourcePath" ref="pdf"></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  name: 'HomePdfViewer',
  components: {
    pdf
  },
  data () {
    return {
      sourcePath: 'https://firebasestorage.googleapis.com/v0/b/sme-markers-data-demo.appspot.com/o/test.pdf?alt=media&token=077f882b-017b-47ad-b862-33d85698f8d4',
      mark: null
    }
  },
  methods: {
    pageLoaded () {
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
.pdfviewer__pdf
  // width: 100%
  overflow: auto
</style>