import Cloudinary from '../config/cloudinary'
import InternetConnection from '../config/connection'
import { markersDB } from '../config/db'
import store from '../store'

let quene = []
// let quene = [ // for test
//   {
//     name: '2-22',
//     floor: '2F',
//     issue: 'D區結構'
//   },
//   {
//     name: '2-23',
//     floor: '2F',
//     issue: 'D區結構'
//   },
//   {
//     name: '2-24',
//     floor: '2F',
//     issue: 'D區結構'
//   },
//   {
//     name: '2-25',
//     floor: '2F',
//     issue: 'D區結構'
//   },
//   {
//     name: '2-26',
//     floor: '2F',
//     issue: 'D區結構'
//   },
// ]

function uploadQueneToDB () {
  quene.map(mission => {
    let id = mission.id
    let modelName = store.getters.modelName

    markersDB.collection(modelName).doc(id)
    .set(mission, { merge: true }).then(() => {
      // console.log('update data to DB success')
      store.commit('setMarkerUpdated', true)
      store.commit('setLoading', false)
      clearQuene()
      console.log('quene 上傳成功')
    }).catch(err => {
      console.log(err.code)
      store.commit('setMarkerUpdated', false)
      console.log(quene)
    })
  })
}

function checkAllImgConvert () {
  let check = true
  quene.forEach(mission => {
    ['plans', 'photos'].forEach(arr => {
      mission[arr].map(picture => {
        if (typeof(picture) !== 'string') {
          check = false
        }
      })
    })
  })

  if (!check) {
    console.log('圖片尚未取得url')
    setTimeout(() => {
      checkAllImgConvert()
    }, 2000)
  } else {
    uploadQueneToDB()
  }
}

function checkPictureConvert () {
  quene.forEach(mission => {
    ['plans', 'photos'].forEach(arr => {
      if (mission[arr].length === 0) {
        console.log('no picture in array')
        return
      }

      mission[arr].forEach((picture, index) => {
        let imgDataUrl = picture[0]
        let text = picture[1]
        if (imgDataUrl.match('base64')) {
          Cloudinary(imgDataUrl).then(res => {
            let url = res.url
            mission[arr][index] = `${url};${text}`
            console.log('convert success')
            // console.log(mission[arr][index])
          })
        } else {
          mission[arr][index] = `${imgDataUrl};${text}`
          console.log('no need to convert')
          // console.log(mission[arr][index])
        }
      })

    })
  })

  checkAllImgConvert()
}

function checkConnection () {
  let connection = InternetConnection()
  connection
  ? checkPictureConvert()
  : console.log('offline now, quene: ' + quene)
}

function clearQuene () {
  quene = []
}

// 如果是同一個mission，新的覆蓋舊的
const addMissionToQuene = (data) => {
  quene = quene.filter(mission => mission.id !== data.id)
  quene.push(data)
  checkConnection()
}

export { addMissionToQuene, quene, checkConnection }