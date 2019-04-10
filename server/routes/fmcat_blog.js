const router = require('koa-router')()
router.prefix('/fmcat/blog')
const sql = require('../util/sql_client')
const sleep = require('../util/sleep')
const oss = require('../util/oss')

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

router.post('/blogTag', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_tag').insert(body).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

router.put('/blogTag', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_tag').where(ctx.query).update(body).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

router.delete('/blogTag', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_tag').where(body).delete().timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})


// 分类相关接口
router.get('/blogClass', async function(ctx, next) {
  let blogClassList = await sql('blog_class').select('*').orderBy('id', 'desc').timeout(10000)
    // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      blogClassList
    }
  }
})

router.post('/blogClass', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_class').insert(body).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

router.put('/blogClass', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_class').where(ctx.query).update(body).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

router.delete('/blogClass', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_class').where(body).delete().timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

// 博客相关接口
router.get('/list', async function(ctx, next) {
  let {
    query
  } = ctx
  let {
    page = 1, pagesize = 10
  } = query
  let blogList = await sql('blog_list').select(['id', 'title', 'tags_text', 'class_id', 'update_time', 'is_top', 'is_disabled']).limit(pagesize).offset((page - 1) * pagesize).orderBy('id', 'desc').timeout(10000)
  let [{
    blogCount
  }] = await sql('blog_list').count('* as blogCount')

  // await sleep(2000)
  ctx.body = {
    code: 200,
    data: {
      blogList,
      blogCount
    }
  }
})

router.get('/detail', async function(ctx, next) {
  let {
    id
  } = ctx.query
  let blogList = await sql('blog_list').select('*').where({
    id
  }).timeout(10000)
  ctx.body = {
    code: 200,
    data: {
      editItem: blogList[0]
    }
  }
})

router.post('/add', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_list').insert(body).timeout(10000)
    await sql('blog_class').where({
      id: body.class_id
    }).increment('count', 1).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

router.put('/edit', async function(ctx, next) {
  let {
    body
  } = ctx.request
  let {
    id
  } = ctx.query

  let {
    title,
    class_id,
    tags_id,
    tags_text,
    markdown,
    html,
    cover
  } = body

  try {
    await sql('blog_list').where({
      id
    }).update({
      title,
      class_id,
      tags_id,
      tags_text,
      markdown,
      html,
      cover
    }).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

router.delete('/delete', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_list').whereIn('id', body.id).delete().timeout(10000)
    await sql('blog_class').whereIn('id', body.classid).decrement('count', 1).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

//设置置顶
router.put('/setTop', async function(ctx, next) {
  let {
    body
  } = ctx.request

  try {
    await sql('blog_list').whereIn('id', body.id).update({
      is_top: body.value
    }).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

//设置禁用
router.put('/setDisabled', async function(ctx, next) {
  let {
    body
  } = ctx.request
  try {
    await sql('blog_list').whereIn('id', body.id).update({
      is_disabled: body.value
    }).timeout(10000)
    ctx.body = {
      code: 200
    }
  } catch (error) {
    throw error
  }
})

module.exports = router