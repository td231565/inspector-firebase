<template>
  <table class="printItem" id="pictures" width="75%" border="1">
    <tr>
      <td colspan="6"><u class="printItem__title">{{ mission.name }}</u></td>
    </tr>

    <tr class="printItem__row">
      <td class="printItem__col" colspan="2">
        <img class="printItem__image" :src="image" alt="" :style="imageInlineCss" :width="imageWidth" :height="imageHeight">
      </td>
      <td class="printItem__col" colspan="2">
        <img class="printItem__image" :src="picturePlan" alt="" :style="imageInlineCss" :width="imageWidth" :height="imageHeight">
      </td>
      <td class="printItem__col" colspan="2">
        <img class="printItem__image" :src="picturePhoto" alt="" :style="imageInlineCss" :width="imageWidth" :height="imageHeight">
      </td>
    </tr>

    <tr class="printItem__row">
      <td class="printItem__col" colspan="2"></td>
      <td class="printItem__col" colspan="2"><pre class="printItem__text" v-html="textPlan"></pre></td>
      <td class="printItem__col" colspan="2"><pre class="printItem__text" v-html="textPhoto"></pre></td>
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
      imageInlineCss: 'text-align: right; width: 207px; border: 0; text-decoration:none; vertical-align: baseline;',
      imageWidth: 250,
      imageHeight: 187
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
  &__text
    margin: 0

</style>