<template>
  <form @submit.prevent="setMarkerInfo">
    <ul class="form">
      <h4 class="form__title">新查驗點資訊</h4>

      <li class="form__items">
        <label class="form__items__title">查驗點名稱</label>
        <input type="text" class="form__items__cells" v-model="name" required />
      </li>
      <li class="form__items">
        <label class="form__items__title">樓層</label>
        <input type="text" class="form__items__cells" v-model="floor" required />
      </li>
      <li class="form__items">
        <label class="form__items__title">查驗項目</label>
        <input type="text" class="form__items__cells" v-model="issue" required />
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
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'NewMarkerForm',
  data () {
    return {
      name: '',
      floor: '',
      issue: '',
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
    ...mapMutations({
      addingNewMarker: 'addingNewMarker'
    }),
    setMarkerInfo () {
      let info = {
        name: this.name,
        floor: this.floor,
        issue: this.issue,
        createDate: this.createDate,
        creator: this.creator,
        accompany: '',
        category: '',
        date: '',
        image: '',
        inspector: '尚未查驗',
        photos: [],
        plans: [],
        point: [],
        problem: '',
        selfCheckState: '',
        status: ''
      }
      this.$emit('addMarkerInfo', info)
    },
    cancelAddNewMarker () {
      this.addingNewMarker(false)
    }
  }
}
</script>

<style lang="scss" scoped>
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