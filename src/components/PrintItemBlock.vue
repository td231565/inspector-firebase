<template>
  <div class="block">
    <td class="block__imageBlock">
      <img class="block__image absolute--top" :src="image" alt="">
    </td>
    <td>
      <pre class="block__text" v-html="text"></pre>
    </td>
  </div>
</template>

<script>
export default {
  name: 'PrintItemblock',
  props: {
    imgAndText: String
  },
  computed: {
    image () {
      if (!this.imgAndText) return
      return (this.imgAndText.match('base64')) ? this.imgAndText : this.imgAndText.split(';')[0]
    },
    text () {
      if (!this.imgAndText) return
      return (this.imgAndText.match('base64')) ? '' : this.imgAndText.split(';')[1]
    }
  }
}
</script>

<style lang="sass" scoped>
.block
  &__imageBlock
    width: 100%
    padding-top: 75%
    position: relative
  &__image
    width: 100%
    display: block

@page
  .block__image
    width: 33%
</style>