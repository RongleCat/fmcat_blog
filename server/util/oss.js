const crypto = require("crypto")

const config = {
  bucket: '******',
  region: 'oss-cn-hangzhou', // 我的是 hangzhou
  accessKeyId: '******',
  accessKeySecret: '******',
  expAfter: 1800000, // 签名失效时间，毫秒
  maxSize: 1048576000 // 文件最大的 size
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    const host = `https://${config.bucket}.${config.region}.aliyuncs.com`
    const expireTime = new Date().getTime() + config.expAfter
    const expiration = new Date(expireTime).toISOString()
    const policyString = JSON.stringify({
      expiration,
      conditions: [
        ['content-length-range', 0, config.maxSize]
        // ['starts-with', '$key', config.dirPath]
      ]
    })
    const policy = Buffer.from(policyString).toString('base64')
    const signature = crypto.createHmac('sha1', config.accessKeySecret).update(policy).digest("base64")
    resolve({
      signature,
      policy,
      host,
      'OSSAccessKeyId': config.accessKeyId,
      'key': expireTime,
      'success_action_status': 200
    })
  })
}
