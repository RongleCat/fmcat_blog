const router = require('koa-router')()
router.prefix('/home')
const sleep = require('../util/sleep')
const sql = require('../util/sql_client')

// 标签相关接口
router.get('/blogTag', async function(ctx, next) {
  let blogTagList = await sql('blog_tag').select('*').orderBy('id', 'desc').timeout(10000)
    // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      blogTagList
    }
  }
})

// 分类相关接口
router.get('/blogClass', async function(ctx, next) {
  let blogClassList = await sql('blog_class').select('*').timeout(10000)
    // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      blogClassList
    }
  }
})

// 博客相关接口
router.get('/blogList', async function(ctx, next) {
  let {
    query
  } = ctx
  let {
    page = 1, pagesize = 10
  } = query
  let blogList = await sql('blog_list').select(['id', 'title', 'cover', 'update_time', 'is_top', 'like', 'hits']).where({ is_disabled: 0 }).limit(pagesize).offset((page - 1) * pagesize).orderBy([{ column: 'is_top', order: 'desc' }, { column: 'update_time', order: 'desc' }]).timeout(10000)
  let [{
    blogCount
  }] = await sql('blog_list').where({ is_disabled: 0 }).count('* as blogCount')

  await sleep(1000)
  ctx.body = {
    code: 200,
    data: {
      blogList,
      blogCount
    }
  }
})

router.get('/blogDetail', async function(ctx, next) {
  let {
    id
  } = ctx.query
  let blogList = await sql('blog_list').select('*').where({
    id
  }).timeout(10000)
  ctx.body = {
    code: 200,
    data: blogList[0]
  }
})

//获取首页音乐
router.get('/music', async function(ctx, next) {
  let musicList = await sql('music_list').select('*').orderByRaw('RAND()').timeout(10000)
    // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      musicList
    }
  }
})

module.exports = router