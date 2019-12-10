import SHA1 from './sha'

export default function (dataUrl) {
  let timestamp = Math.floor(Date.now() / 1000)
  let api_secret = 'yynjtJYNqqHy2XWvBh7x4taVNjI'
  let str = `timestamp=${timestamp}${api_secret}` // 規定最後須加上 api_secret
  
  // 將 base64:image 上傳到 cloudinary 轉換成實體圖片
  return fetch('https://api.cloudinary.com/v1_1/ctcimage/image/upload', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      timestamp: timestamp, // 時間戳記 required
      file: dataUrl, // 欲轉換的 base64 編碼
      api_key: '653999464428459',
      signature: SHA1(str) // 轉換後的 SHA1 字串
    })
  })
  .catch(err => console.log(err))
  .then(res => res.json())
}
