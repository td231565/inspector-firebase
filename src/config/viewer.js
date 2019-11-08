let viewerServerHost = 'https://viewer.ctc.com.tw'
let modelPath = 'dxbim/fb8da11f09f542b4b344338aea29d771/83ce08590d0844ed8e171ae8a44a596f/1771ca6b1cc54dfb955fad322a23f23d.asm'
let viewerIframe = document.getElementById('viewerIframe')
let _iframeWindow = viewerIframe.contentWindow

// 查詢屬性
function updatePropertyPanel(id){
  let msg = {
    type: 'MSG_GET_INHERENT_PROPERTY',
    data: {
      path: modelPath,
      id: id
    }
  }
  _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
}

// 隔離選取物件
const toggleDisplayMode = {
  toggleFlag: 0,
  switch: function (btn) {
    let msg =  {
      type: 'MSG_SET_SELECTION_DISPLAY_MODE',
      data: {
        mode: ++this.toggleFlag % 2
      }
    }
    _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
    btn.textContent = (this.toggleFlag % 2 === 1) ? '隔離模式(On)' : '隔離模式(Off)'
  }
}

// 創建視點
function createSnapshotCallback () {
  var msg = {
    type: 'MSG_TAKE_SNAPSHOT',
    data: {
      id: '01'
    }
  }
  _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
}

// 呼叫視點
function gotoSnapshot (selectedShot) {
  var msg = {
    type: 'MSG_VIEW_SNAPSHOT',
    data: {
      status: selectedShot
    }
  }
  _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
}

// 圖台標記
function createMarkers (point, id, floor, name, issue) {
  let markIcon = 'data:image/png;base64,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'
  if (!point) return

  var msg = {
    type: 'MSG_CREATE_MARKER',
    data: {
      markers: [
        {
          id: id, // Id from Firestore
          name: `${floor}_${issue}_${name}`, // 樓層_項目_地點，5F_D2_stairs1
          icon: markIcon,
          size: [30, 30], // set marker icon size [ width, height ]
          position: point // set by position or id
        }
      ]
    }
  }
  // console.log(point)
  _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
}

// 圖台內標記
function pickPoint (point) {
  var msg = {
    type: 'MSG_PICK_POINT',
    data: {
      point: point
    }
  }
  _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
}

// 設置工具列
function setToolbar () {
  let msg = {
    type: 'MSG_SET_TOOLBAR_ITEMS',
    data: {
      items: ["cube", "roam", "show", "hide", "isolation", "modeltree", "axissection", "zrotate", "goto", "measure", "mark", "settings", "props"]
    }
  }
  _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
}

// 六視圖
function setView (view) {
  let msg = {
    type: 'MSG_SET_VIEW',
    data: {
      view: view
    }
  }
  _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
}

//
function removeMarker (markers) {
  let msg = {
    type: 'MSG_REMOVE_MARKER',
    data: {
      markers // ['id']
    }
  }
  _iframeWindow.postMessage(JSON.stringify(msg), viewerServerHost)
}