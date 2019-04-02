const router = require('koa-router')()
router.prefix('/fmcat/music')
const sql = require('../util/sql_client')
const sleep = require('../util/sleep')
const oss = require('../util/oss')

router.get('/', async function(ctx, next) {
  let {
    query
  } = ctx
  let {
    page = 1, pagesize = 12
  } = query
  let musicList = await sql('music_list').select('*').limit(pagesize).offset((page - 1) * pagesize).orderBy('add_time', 'desc').timeout(10000)
  let [{
    musicCount
  }] = await sql('music_list').count('* as musicCount')
    // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      musicList,
      musicCount
    }
  }
})

router.post('/', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('music_list').insert(body).timeout(10000)
    ctx.body = {
      code: 200,
      data: {
        ossPolicy: await oss()
      }
    }
  } catch (error) {
    throw error
  }
})

router.put('/:id', async function(ctx, next) {
  let {
    body
  } = ctx.request
  delete body.id
  delete body.add_time
  try {
    await sql('music_list').where(ctx.params).update(body).timeout(10000)
    ctx.body = {
      code: 200,
      data: {
        ossPolicy: await oss()
      }
    }
  } catch (error) {
    throw error
  }
})

router.delete('/', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('music_list').where(body).delete().timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

module.exports = router