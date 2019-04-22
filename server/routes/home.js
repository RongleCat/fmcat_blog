const router = require('koa-router')()
router.prefix('/home')
const sleep = require('../util/sleep')
const sql = require('../util/sql_client')
const tools = require('../util/tools')

// 标签相关接口
router.get('/blogTag', async function (ctx, next) {
  let blogTagList = await sql('blog_tag')
    .select('*')
    .orderBy('id', 'desc')
    .timeout(10000)
  // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      blogTagList
    }
  }
})

// 分类相关接口
router.get('/blogClass', async function (ctx, next) {
  let blogClassList = await sql('blog_class')
    .select('*')
    .timeout(10000)
  // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      blogClassList
    }
  }
})

// 博客相关接口
router.get('/blogList', async function (ctx, next) {
  let { query } = ctx
  let { page = 1, pagesize = 10, class_id, tag_id } = query
  let rule = {
    is_disabled: 0
  }
  if (class_id) {
    rule.class_id = class_id
  }

  if (tag_id) {
    let blogList = await sql('blog_list')
      .select(['id', 'title', 'cover', 'update_time', 'is_top', 'like', 'hits'])
      .where(rule)
      .andWhere('tags_id', 'like', `%${tag_id}%`)
      .orderBy([{ column: 'is_top', order: 'desc' }, { column: 'update_time', order: 'desc' }])
      .limit(pagesize)
      .offset((page - 1) * pagesize)
      .timeout(10000)
    let [{ blogCount }] = await sql('blog_list')
      .where(rule)
      .andWhere('tags_id', 'like', `%${tag_id}%`)
      .count('* as blogCount')
      .timeout(10000)
    ctx.body = {
      code: 200,
      data: {
        blogList,
        blogCount
      }
    }
  } else {
    let blogList = await sql('blog_list')
      .select(['id', 'title', 'cover', 'update_time', 'is_top', 'like', 'hits'])
      .where(rule)
      .limit(pagesize)
      .offset((page - 1) * pagesize)
      .orderBy([{ column: 'is_top', order: 'desc' }, { column: 'update_time', order: 'desc' }])
      .timeout(10000)
    let [{ blogCount }] = await sql('blog_list')
      .where(rule)
      .count('* as blogCount')
      .timeout(10000)
    ctx.body = {
      code: 200,
      data: {
        blogList,
        blogCount
      }
    }
  }
})

router.get('/blogDetail', async function (ctx, next) {
  let { id } = ctx.query
  try {
    await sql('blog_list')
      .where({ id })
      .increment('hits', 1)
      .timeout(10000)
    let blogList = await sql('blog_list')
      .select('*')
      .where({
        id
      })
      .timeout(10000)
    if (blogList.length) {
      ctx.body = {
        code: 200,
        data: blogList[0]
      }
    } else {
      ctx.body = {
        code: 200,
        data: {
          error: 1,
          msg: `没有查询到Id为${id}的文章`
        }
      }
    }
  } catch (error) {
    ctx.body = {
      code: 0,
      msg: '文章内容查询错误'
    }
  }
})

router.get('/blogLike', async function (ctx, next) {
  let { id } = ctx.query
  try {
    await sql('blog_list')
      .where({ id })
      .increment('like', 1)
      .timeout(10000)
    await sleep(1000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    ctx.body = {
      code: 0,
      msg: '点赞失败'
    }
  }
})

//获取首页音乐
router.get('/music', async function (ctx, next) {
  let musicList = await sql('music_list')
    .select('*')
    .orderByRaw('RAND()')
    .timeout(10000)
  // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      musicList
    }
  }
})

module.exports = router