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

router.get('/getPrintData', async function(ctx, next) {
  console.log(ctx.params);
  console.log(ctx.body);
  console.log(ctx.querys);
  console.log(ctx);
  ctx.body = {
    data: "OK"
  }
})

router.post('/getPrintData', async function(ctx, next) {
  console.log(ctx.params);
  console.log(ctx.request.body);
  console.log(ctx.querys);
  ctx.body = {
    data: "OK"
  }
})

module.exports = router