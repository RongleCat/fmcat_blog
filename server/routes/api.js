const router = require('koa-router')()
const sql = require('../util/sql_client')
const sleep = require('../util/sleep')
const oss = require('../util/oss')
router.prefix('/api')

router.get('/getOssToken', async function(ctx, next) {
  let ossPolicy = await oss()
  ctx.body = {
    code: 200,
    data: {
      ossPolicy
    }
  }
})

module.exports = router