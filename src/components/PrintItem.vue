<template>
  <table class="printItem" id="pictures" width="100%" border="1">
    <tr class="printItem__row">
      <td class="printItem__col" colspan="3">
        <u class="printItem__title">{{ mission.floor }} - {{ mission.issue }} - {{ mission.name }}</u>
      </td>
    </tr>

    <tr class="printItem__row">
      <td class="printItem__col">
        <img class="printItem__image" :src="image" alt="" :style="imageInlineCss" :width="imageWidth" :height="imageHeight">
      </td>
      <td class="printItem__col">
        <img class="printItem__image" :src="picturePlan" alt="" :style="imageInlineCss" :width="imageWidth" :height="imageHeight">
      </td>
      <td class="printItem__col">
        <img class="printItem__image" :src="picturePhoto" alt="" :style="imageInlineCss" :width="imageWidth" :height="imageHeight">
      </td>
    </tr>

    <tr class="printItem__row">
      <td class="printItem__col"></td>
      <td class="printItem__col"><pre class="printItem__text" v-html="textPlan"></pre></td>
      <td class="printItem__col"><pre class="printItem__text" v-html="textPhoto"></pre></td>
    </tr>

  </table>
</template>

<script>
export default {
  name: 'PrintItem',
  props: {
    mission: Object
  },
  data () {
    return {
      imageInlineCss: '',
      imageWidth: 250,
      imageHeight: 187
      // imageWidth: '',
      // imageHeight: ''
    }
  },
  computed: {
    image () {
      return this.mission.image
    },
    picturePlan () {
      return this.mission.plans[0].split(';')[0]
    },
    picturePhoto () {
      return this.mission.photos[0].split(';')[0]
    },
    textPlan () {
      return this.mission.plans[0].split(';')[1]
    },
    textPhoto () {
      return this.mission.photos[0].split(';')[1]
    }
  }
}
</script>

<style lang="sass" scoped>
.printItem
  &__row
    display: flex
  &__col
    flex: 1
  &__image
    width: 100%
    height: auto
  &__text
    margin: 0

</style>