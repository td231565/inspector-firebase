<template>
  <form @submit.prevent="setMarkerInfo" class="add-new absolute--top flex--center">
    <ul class="form" v-show="!isPickPoint">
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

    <div class="add-new__cover" v-show="isPickPoint" @click="pickPointOnViewer">
      <h2>請於模型上放置本次查驗點標記</h2>
    </div>
  </form>
</template>

<script>
import BIM from '../config/bimviewer'
import { format } from 'date-fns'
import { mapState , mapMutations } from 'vuex'

export default {
  name: 'NewMarker',
  props: {
    viewerServerHost: String,
    image: String,
    status: Object
  },
  data () {
    return {
      createDate: format(new Date, 'yyyy-MM-dd'),
      isPickPoint: false,
      newMarkData: undefined
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
        image: this.image,
        cameraStatus: this.status,
        plans: [],
        photos: []
      })

      // console.log(formData)
      this.newMarkData = formData
      this.revealCoverLayer()
    },
    cancelAddNewMarker () {
      this.$emit('hideNewMarkForm')
    },
    finishAddNewMarker () {
      this.$emit('setNewMarker', this.newMarkData)
      this.$emit('hideNewMarkForm')
    },
    revealCoverLayer () {
      this.isPickPoint = true
    },
    hideCoverLayer () {
      this.isPickPoint = false
    },
    pickPointOnViewer (e) {
      const cover = e.target
      const pickOverlayBoundingClientRect = cover.getBoundingClientRect()
      let x = e.clientX - pickOverlayBoundingClientRect.left
      let y = e.clientY - pickOverlayBoundingClientRect.top
      let point = [x, y]

      BIM.pickPoint(point)
    },
    viewerMessageHandler (e) {
      const vm = this
      if (e.origin !== vm.viewerServerHost) return

      let dataObj = (typeof e.data === 'object') ? e.data : JSON.parse(e.data)
      switch (dataObj.type) {
        // 回傳模型座標
        case 'MSG_RETURN_PICKED_POINT': {
          let modelPoint = dataObj.data.result.slice(0, 3)
          // console.log(modelPoint)
          vm.newMarkData['point'] = modelPoint
          vm.finishAddNewMarker()
          break
        }
      }
    }
  },
  created () {
    window.addEventListener('message', this.viewerMessageHandler, false)
  },
  beforeDestroy () {
    this.hideCoverLayer()
    window.removeEventListener('message', this.viewerMessageHandler, false)
  }
}
</script>

<style lang="scss" scoped>
.add-new {
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.6);
  &__cover {
    width: 100%;
    height: 100%;
    color: #fff;
  }
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