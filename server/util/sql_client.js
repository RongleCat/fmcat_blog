const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: '******',
    password: '******',
    database: '******',
    charset: 'utf8mb4'
  },
  pool: {
    min: 5,
    max: 1000
  },
  acquireConnectionTimeout: 60000,
  asyncStackTraces: false, // 捕获堆栈跟踪，正式环境不要开启，会消耗性能
  migrations: {
    tableName: 'knex_migrations' // 记录版本控制的表用哪个
  },
  log: {
    warn(message) {
      console.log('[knex warn]', message)
    },
    error(message) {
      console.log('[knex error]', message)
    },
    deprecate(message) {
      console.log('[knex deprecate]', message)
    },
    debug(message) {
      console.log('[knex debug]', message)
    }
  }
});

module.exports = knex