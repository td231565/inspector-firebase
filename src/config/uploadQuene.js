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
  function checkAllImgConvert () {
    let check = true
    quene.forEach(mission => {
      ['plans', 'photos'].forEach(arr => {
        mission[arr].map(picture => {
          // console.log(typeof(picture))
          // console.log('before checking: ' + picture)
          if (typeof(picture) !== 'string') {
            // console.log('after checking: ' + picture)
            check = false
          }
        })
      })
    })
    return check
  }
  
  let isAllImgConverted = checkAllImgConvert()
  if (!isAllImgConverted) {
    console.log('picture not convert')
    return
  }

  quene.map(mission => {
    let id = mission.id
    let modelName = store.getters.modelName

    markersDB.collection(modelName).doc(id)
    .set(mission, { merge: true }).then(() => {
      // console.log('update data to DB success')
      store.commit('setMarkerUpdated', true)
      clearQuene()
      console.log('upload data success' + quene)
    }).catch(err => {
      console.log(err.code)
      store.commit('setMarkerUpdated', false)
      console.log(quene)
    })
  })
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
  setTimeout(() => {
    uploadQueneToDB()
  }, 2000)
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
  function detectMission () {
    let sameMission = false
    quene.forEach((mission, i) => {
      if (mission.id === data.id) {
        sameMission = true
        quene[i] = data
      }
    })
    return sameMission
  }

  let sameMission = detectMission()
  if (sameMission) return
  // console.log(data)
  quene.push(data)
  checkConnection()
}

export { addMissionToQuene, quene, checkConnection }