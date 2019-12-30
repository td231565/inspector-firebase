<template>
  <form @submit.prevent="setMarkerInfo" class="add-new absolute--top flex--center">
    <ul class="form">
      <h4 class="form__title">新查驗點資訊</h4>

      <li class="form__items">
        <label class="form__items__title">查驗項目</label>
        <input type="text" name="查驗項目" class="form__items__cells" required />
      </li>
      <li class="form__items">
        <label class="form__items__title">樓層位置</label>
        <input type="text" name="樓層位置" class="form__items__cells" required />
      </li>
      <li class="form__items">
        <label class="form__items__title">建立人員</label>
        <input type="text" name="建立人員" class="form__items__cells" v-model="creator" disabled required />
      </li>
      <li class="form__items">
        <label class="form__items__title">建立日期</label>
        <input type="date" name="建立日期" class="form__items__cells" v-model="createDate" disabled required />
      </li>
      <li class="form__items__footer flex--center">
        <button type="submit" class="btn btn__square">確定</button>
        <button class="btn btn__square" @click="cancelAddNewMarker">取消</button>
      </li>
    </ul>
  </form>
</template>

<script>
import { format } from 'date-fns'
import { mapState /*, mapMutations */ } from 'vuex'

export default {
  name: 'NewMarker',
  data () {
    return {
      createDate: format(new Date, 'yyyy-MM-dd')
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userState.userInfo
    }),
    creator () {
      return this.userInfo.name
    }
  },
  methods: {
    setMarkerInfo (e) {
      let form = e.target.elements
      let formData = {}

      for (let i=0; i<form.length; i++) {
        if (!form[i].name) continue
        formData[i+1] = {
          name: form[i].name,
          type: form[i].type,
          value: form[i].value
        }
      }

      formData = Object.assign(formData, {
        plans: [],
        photos: []
      })

      // console.log(formData)

      this.$emit('addMarkerInfo', formData)
    },
    cancelAddNewMarker () {
      this.$emit('hideNewMarkForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-new {
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.6);
}

.form {
  width: 60%;
  margin: 2rem auto;
  padding: 2rem;
  background-color: $bg_default;
  &__title {
    margin-top: 0;
  }
}

.btn {
  &:hover {
    border-color: $bd_input_focus;
  }
}
</style>