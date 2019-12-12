import Cloudinary from '../config/cloudinary'
import InternetConnection from '../config/connection'
import { markersDB } from '../config/db'
import store from '../store'

let quene = []

function uploadQueneToDB () {
  let isAllImgConverted = quene.forEach(mission => {
    let check = true
    ;['plans', 'photos'].forEach(arr => {
      mission[arr].map(picture => {
        if (typeof(picture) !== 'string') {
          console.log(picture)
          check = false
        }
      })
    })
    return check
  })

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
      // commit('setMarkerUpdated', true)
      clearQuene()
    }).catch(err => {
      console.log(err.code)
      // commit('setMarkerUpdated', false)
    })
  })

  console.log(quene)
}

// function convertPicture (picture) {
//   let imgDataUrl = picture[0]
//   let text = picture[1]
//   if (imgDataUrl.match('base64')) {
//     Cloudinary(imgDataUrl).then(res => {
//       let url = res.url
//       picture = `${url};${text}`
//     })
//   } else {
//     picture = `${imgDataUrl};${text}`
//   }
// }

function checkPictureConvert () {
  quene.forEach((mission) => {
    ['plans', 'photos'].forEach(arr => {
      let count = 0

      mission[arr].forEach((picture) => {
        // convertPicture(picture)
        let imgDataUrl = picture[0]
        let text = picture[1]
        if (imgDataUrl.match('base64')) {
          Cloudinary(imgDataUrl).then(res => {
            let url = res.url
            picture = `${url};${text}`
            console.log(picture)
            count++
          })
        } else {
          picture = `${imgDataUrl};${text}`
          count++
        }
      })

      setTimeout(() => {
        console.log(count)
        uploadQueneToDB()
      }, 2000)
    })
  })
  // setTimeout(() => {
  //   uploadQueneToDB()
  // }, 2000)
}

function checkConnection () {
  let connection = InternetConnection()
  connection
  ? checkPictureConvert()
  : ''
}

function clearQuene () {
  quene = []
}

const addMissionToQuene = (data) => {
  quene.push(data)
  checkConnection()
}

export { addMissionToQuene }