 export function   getBase64FromLocalAsync (imgUrl) {
    return new Promise((resolve, reject) => {
      uni.getFileSystemManager().readFile({
        filePath: imgUrl,
        encoding: "base64",
        success: res => {
          resolve('data:image/png;base64,' + res.data)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
