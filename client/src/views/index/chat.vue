<template>
  <div class="chat-container">
    <div class="chat-main">
      <canvas id="stage" @click="changeFocus('focus')"></canvas>
      <div class="join-chat">
        <template v-if="!is_join">
          <div class="left">
            <div class="el-input name-input">
              <input placeholder="输入昵称" v-model="joinName" type="text" class="el-input__inner"
                @keypress.enter="joinChat">
            </div>
            <el-button type="success" @click="joinChat">加入聊天</el-button>
          </div>
          <div class="right roleList">
            <swiper v-if="coverList" :options="swiperOption" ref="mySwiper">
              <swiper-slide v-for="(item,index) in coverList" :key="index"
                class="swiper-item" :class="[roleSelectIndex==index?'active':'']">
                <img :src="`https://fmcat-common-static.oss-cn-hangzhou.aliyuncs.com/chat/role_cover/${item}.png`"
                  draggable="false">
              </swiper-slide>
            </swiper>
          </div>
        </template>
        <template v-else>
          <div class="chat-input">
            <div class="el-input">
              <input placeholder="请输入内容" v-model="chatContent" type="text"
                class="el-input__inner" @keypress.enter="emitChat" id="chat">
            </div>
            <el-button type="primary" :disabled="!chatContent.length" @click="emitChat">发送</el-button>
          </div>
        </template>
      </div>
      <div class="tip">操作说明：<span>←</span><span>→</span>控制移动<span class="down">↓</span>趴下<span>Space</span>跳跃，<span>Enter</span>开始聊天，焦点丢失点击画面重新获取焦点</div>
      <input type="text" id="focus" class="input-focus" @keypress.enter="changeFocus('chat')">
    </div>
  </div>
</template>

<script>
import Wait from '../../components/Wait'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

let W = 800,
  H = 600
let roles = {}
let images = {}
let myName = ''
let myRole = null
let isWalk = false
let timers = {}
let roleImages = []
let chatStorage = []
export default {
  data() {
    return {
      context: null,
      joinName: '',
      coverList: null,
      roleSelectIndex: 0,
      is_join: false,
      chatContent: '',
      swiperOption: {
        slidesPerView: 8,
        spaceBetween: 10,
        centeredSlides: true,
        slideToClickedSlide: true,
        on: {
          slideChangeTransitionStart: () => {
            if (this.swiper) {
              this.roleSelectIndex = this.swiper.realIndex
            }
          }
        }
      }
    }
  },
  components: {
    Wait,
    swiper,
    swiperSlide
  },
  created() {
    if (this.$socket.connected) {
      console.log('%c已连接到花喵聊天室', 'color:#fff;background:#46bd87;padding:4px 8px;border-radius: 4px;')
      this.$socket.emit('reGetUser')
    }
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = 'https://fmcat-common-static.oss-cn-hangzhou.aliyuncs.com/js/keyboard.min.js'
    document.body.appendChild(s)
  },
  mounted() {
    this.swiper()
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  sockets: {
    connect() {
      console.log('%c已连接到花喵聊天室', 'color:#fff;background:#46bd87;padding:4px 8px;border-radius: 4px;')
    },
    customEmit(val) {
      console.log(val)
    },
    disconnect() {
      console.log('已断线')
    },
    getUsers(data) {
      roles = data.users
      // chatStorage = data.chatStorage
      // for (var i = 0; i < chatStorage.length; i++) {
      //   $('.chat-list').append('<li>' + chatStorage[i] + '</li>')
      //   chatToBottom()
      // }
    },
    actionCtrl(action) {
      let that = this
      if (action.actionName === 'walk') {
        that.walkCtrl(action.actionUser, action.actionValue)
      } else if (action.actionName === 'jump') {
        that.jumpCtrl(action.actionUser)
      } else if (action.actionName === 'down') {
        if (action.actionValue === 'down') {
          that.changeRoleState(action.actionUser, 1)
        } else if (action.actionValue === 'up') {
          that.changeRoleState(action.actionUser, 0)
        }
      }
    },
    addUser(r) {
      if (r.code === 0) {
        this.$message.error(r.msg)
      } else {
        roles[r.data.name] = r.data
      }
    },
    userJoin(r) {
      if (r.code === 0) {
        this.$message.error(r.msg)
      } else {
        myName = r.data.name
        myRole = r.data
        this.is_join = true
        roles[r.data.name] = r.data
        this.roleKeyBind(myName, this.$socket)
        // $('.join-box')
        //   .add('.mask-layer')
        //   .remove()
        // $('#jiaodian').focus()
      }
    },
    userChat(r) {
      roles[r.userName].chatText = r.chatText
      // if (chatStorage.length > 100) {
      //   chatStorage.shift()
      //   $('.chat-list')
      //     .find('li')
      //     .eq(0)
      //     .remove()
      //   chatToBottom()
      // }
      // if (r.chatText !== '') {
      //   chatStorage.push(r.userName + '：' + r.chatText)
      //   $('.chat-list').append('<li>' + r.userName + '：' + r.chatText + '</li>')
      //   chatToBottom()
      // }
    },
    deleteUser(r) {
      let that = this
      that.walkCtrl(r.userName, 'stop')
      window.clearInterval(timers[r.userName])
      window.clearInterval(timers[r.userName + 'walk'])
      delete roles[r.userName]
    }
  },
  mounted() {
    let that = this
    let context = (that.context = document.querySelector('#stage').getContext('2d'))
    context.canvas.width = W
    context.canvas.height = H
    let canvasLoading = that.$loading({
      target: '.chat-main',
      text: '正在加载聊天室资源...'
    })
    that.$axios('https://chat.fmcat.top/getResources').then(r => {
      var imgs = r.data.imgs
      var promises = []
      if (r.status === 200) {
        for (var i = 0; i < imgs.length; i++) {
          promises.push(that.loadImages(imgs[i]))
        }
      }
      Promise.all(promises).then(function(results) {
        console.log('资源加载完成')
        canvasLoading.close()
        that.coverList = roleImages
        that.drawStage(context, images.bg)
        that.drawRole(context)
        // 初始化所有人物动作
        for (var i in roles) {
          that.changeRoleState(roles[i].name, 0)
        }

        //每秒24帧清空画布重新画背景，人物
        setInterval(function() {
          context.clearRect(0, 0, W, H)
          that.drawStage(context, images.bg)
          that.drawRole(context)
          if (myName) {
            that.$socket.emit('positionSync', {
              position_x: roles[myName].state.x,
              actionUser: myName
            })
          }
        }, 1000 / 24)
      })
    })
  },
  methods: {
    changeFocus(focusName) {
      document.querySelector('#' + focusName).focus()
    },
    loadImages(filename) {
      var bgImage = new Image()
      bgImage.src = 'https://fmcat-common-static.oss-cn-hangzhou.aliyuncs.com/chat/' + filename + '.png'
      var p = new Promise(function(resolve, reject) {
        bgImage.onload = function() {
          if (filename.indexOf('/') !== -1) {
            filename = filename.split('/')[1]
            roleImages.push(filename)
          }
          images[filename] = bgImage
          resolve(filename)
        }
      })
      return p
    },
    joinChat() {
      let { roleSelectIndex, coverList, joinName: userName } = this
      if (!userName.length || userName.length > 6) {
        this.$message.error('用户名为1-6位字符长度')
        return false
      }
      let roleImagesName = coverList[roleSelectIndex]
      this.$confirm(`确认以"${userName}"昵称加入聊天室？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(() => {
        this.$socket.emit('userJoin', {
          userName,
          roleImagesName
        })
      })
    },
    emitChat() {
      let that = this
      let { chatContent } = that
      if (!chatContent.length) {
        return false
      }
      window.clearTimeout(timers[myName + 'chat'])
      roles[myName].chatText = chatContent
      that.$socket.emit('userChat', {
        userName: myName,
        chatText: chatContent
      })
      timers[myName + 'chat'] = setTimeout(function() {
        roles[myName].chatText = ''
        that.$socket.emit('userChat', {
          userName: myName,
          chatText: ''
        })
      }, 5000)
      that.chatContent = ''
      that.changeFocus('focus')
    },
    drawStage(ctx, imageUrl) {
      ctx.rect(0, 0, W, H)
      ctx.fillStyle = ctx.createPattern(images.bg, 'no-repeat')
      ctx.fill()
    },
    drawRole(context) {
      let that = this
      for (var i in roles) {
        if (roles[i].name == myName) {
          myRole = roles[i]
          continue
        }
        draw(roles[i], context)
      }
      if (myName) {
        draw(roles[myName], context)
      }

      function draw(item, context) {
        var img = images[item.roleImg]
        var role = item
        var deviationY = parseInt(item.roleImg.split('_')[3])
        var roleWidth = img.width / 9
        var nameWidth = 0
        var count = 0
        for (var i = 0; i < role.name.length; i++) {
          if (/[^\x00-\xff]/.test(role.name[i])) {
            count += 2
          } else {
            count += 1
          }
        }
        nameWidth = count * 6

        //画人物动作
        context.save()
        //判断是否向左走，向左走得水平翻转人物
        if (role.state.isfilp) {
          context.translate(800, 0)
          context.scale(-1, 1)
          context.drawImage(
            img,
            (role.state.imageIndex * img.width) / 9,
            0,
            img.width / 9,
            img.height,
            800 - (role.state.x + img.width / 9),
            480 - img.height - role.state.y + deviationY,
            img.width / 9,
            img.height
          )
        } else {
          context.drawImage(
            img,
            (role.state.imageIndex * img.width) / 9,
            0,
            img.width / 9,
            img.height,
            role.state.x,
            480 - img.height - role.state.y + deviationY,
            img.width / 9,
            img.height
          )
        }
        context.restore()
        //画人物名字框

        context.beginPath()
        context.lineJoin = 'round'
        context.lineWidth = 8
        context.strokeStyle = 'rgba(0,0,0,.4)'
        context.strokeRect(role.state.x + (roleWidth - nameWidth) / 2, 480 + 8 - role.state.y, nameWidth, 8)
        //写人物名字
        context.font = '12px 宋体'
        context.fillStyle = '#fff'
        context.fillText(role.name, role.state.x + (roleWidth - nameWidth) / 2, 480 + 16 - role.state.y)
        context.closePath()
        //如果有聊天文字，则开始绘制聊天框和文字
        if (role.chatText.length !== 0) {
          var length = role.chatText.length
          that.drawChatText(
            context,
            role.name + '：' + role.chatText,
            role.state.x,
            role.state.y - deviationY,
            img.width / 9,
            img.height
          )
        }
      }
    },
    drawChatText(context, text, x, y, roleWidth, roleHeight) {
      var len = text.length,
        count = 0,
        line = [],
        oneLine = ''
      //单行文字截取，一行14个字节长度。中文=2，英文=1
      for (var i = 0; i < len; i++) {
        if (/[^\x00-\xff]/.test(text[i])) {
          count += 2
        } else {
          count += 1
        }
        oneLine += text[i]
        if (count == 13) {
          if (/[^\x00-\xff]/.test(text[++i])) {
            line.push(oneLine)
            count = 0
            oneLine = ''
            i--
          }
        } else if (count == 14) {
          line.push(oneLine)
          oneLine = ''
          count = 0
        }
      }
      line.push(oneLine)

      var textHeight = line.length * 16,
        starY = 480 - y - roleHeight - images.chat_bg3.height,
        startX = x + (roleWidth - images.chat_bg3.width) / 2
      //画聊天框底边
      context.drawImage(images.chat_bg3, startX, starY, images.chat_bg3.width, images.chat_bg3.height)
      //画聊天框内容背景
      for (var i = 1; i < textHeight + 1; i++) {
        context.drawImage(images.chat_bg2, startX, starY - i, images.chat_bg2.width, images.chat_bg2.height)
      }
      //画聊天框顶边
      context.drawImage(
        images.chat_bg1,
        startX,
        starY - textHeight - images.chat_bg1.height,
        images.chat_bg1.width,
        images.chat_bg1.height
      )
      //在聊天框上写字
      for (var i = 0; i < line.length; i++) {
        context.beginPath()
        context.font = '12px 宋体'
        context.fillStyle = '#000'
        context.fillText(line[i], 5 + startX, starY - textHeight - images.chat_bg1.height + (i + 1) * 16)
        context.closePath()
      }
    },
    changeRoleState(roleanme, state) {
      window.clearInterval(timers[roleanme])
      var rule = [0, 1, 2, 1],
        fun,
        speed = 0,
        index = 1
      if (!roles[roleanme]) {
        return
      }
      if (state == 0) {
        speed = 500
        roles[roleanme].state.imageIndex = 0
        fun = function() {
          if (index == rule.length) {
            index = 0
          }
          roles[roleanme].state.imageIndex = rule[index++]
        }
      } else if (state == 1) {
        speed = 0
        fun = function() {
          index = 0
          roles[roleanme].state.imageIndex = 8
        }
      } else if (state == 2) {
        speed = 150
        rule = [3, 4, 5, 6]
        roles[roleanme].state.imageIndex = 1
        fun = function() {
          if (index == rule.length) {
            index = 0
          }
          roles[roleanme].state.imageIndex = rule[index++]
        }
      } else if (state == 3) {
        speed = 0
        fun = function() {
          index = 0
          roles[roleanme].state.imageIndex = 7
        }
      }
      timers[roleanme] = setInterval(fun, speed)
    },
    walkCtrl(name, state) {
      //如果状态是停止则清除定时器
      if (state === 'stop') {
        window.clearInterval(timers[name + 'walk'])
        if (name) {
          roles[name].state.isWalk = false
          this.changeRoleState(name, 0)
        }
      } else {
        var roleWidth = images[roles[name].roleImg].width / 9
        //先设置人物图片状态
        this.changeRoleState(name, 2)
        if (!roles[name]) {
          return
        }
        roles[name].state.isWalk = true
        timers[name + 'walk'] = setInterval(function() {
          //判断左右更改人物水平位置
          if (state === 'right') {
            roles[name].state.isfilp = false
            if (roles[name].state.x + roleWidth + 2 >= W) {
              roles[name].state.x = W - roleWidth
            } else {
              roles[name].state.x += 4
            }
          } else {
            roles[name].state.isfilp = true
            if (roles[name].state.x <= 0) {
              roles[name].state.x = 0
            } else {
              roles[name].state.x -= 4
            }
          }
        }, 1000 / 24)
      }
    },
    jumpCtrl(name) {
      let that = this
      var step = 12
      if (roles[name].state.isJump) {
        return false
      }
      roles[name].state.isJump = true
      this.changeRoleState(name, 3)
      window.clearInterval(timers[name + 'jump'])
      timers[name + 'jump'] = setInterval(function() {
        roles[name].state.y += step
        step -= 1.5
        if (roles[name].state.y <= 0) {
          roles[name].state.y = 0
          window.clearInterval(timers[name + 'jump'])
          if (roles[name].state.isWalk) {
            that.changeRoleState(name, 2)
          } else {
            that.changeRoleState(name, 0)
          }
          roles[name].state.isJump = false
        }
      }, 1000 / 24)
    },
    roleKeyBind(myName, socket) {
      let that = this
      let $focus = document.querySelector('#focus')
      keyboardJS.watch($focus)
      $focus.focus()

      //跳跃
      keyboardJS.bind('space', function(e) {
        that.jumpCtrl(myName)
        socket.emit('actionCtrl', {
          actionName: 'jump',
          actionValue: '',
          actionUser: myName
        })
      })
      //向左走
      keyboardJS.bind(
        'left',
        function(e) {
          if (!e.repeat && !isWalk) {
            isWalk = true
            that.walkCtrl(myName, 'left')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'left',
              actionUser: myName
            })
          }
        },
        function() {
          isWalk = false
          that.walkCtrl(myName, 'stop')
          socket.emit('actionCtrl', {
            actionName: 'walk',
            actionValue: 'stop',
            actionUser: myName
          })
        }
      )

      //向右走
      keyboardJS.bind(
        'right',
        function(e) {
          if (!e.repeat && !isWalk) {
            that.walkCtrl(myName, 'right')
            isWalk = true
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'right',
              actionUser: myName
            })
          }
        },
        function() {
          isWalk = false
          that.walkCtrl(myName, 'stop')
          socket.emit('actionCtrl', {
            actionName: 'walk',
            actionValue: 'stop',
            actionUser: myName
          })
        }
      )
      //趴下
      keyboardJS.bind(
        'down',
        function(e) {
          if (!e.repeat) {
            that.changeRoleState(myName, 1)
            socket.emit('actionCtrl', {
              actionName: 'down',
              actionValue: 'down',
              actionUser: myName
            })
          }
        },
        function() {
          that.changeRoleState(myName, 0)
          socket.emit('actionCtrl', {
            actionName: 'down',
            actionValue: 'up',
            actionUser: myName
          })
        }
      )

      keyboardJS.bind(
        'down > left',
        function(e) {
          if (!e.repeat) {
            that.walkCtrl(myName, 'left')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'left',
              actionUser: myName
            })
          }
        },
        function() {
          that.walkCtrl(myName, 'stop')
          socket.emit('actionCtrl', {
            actionName: 'walk',
            actionValue: 'stop',
            actionUser: myName
          })
          keyboardJS.pressKey('down')
        }
      )

      keyboardJS.bind(
        'down > right',
        function(e) {
          if (!e.repeat) {
            that.walkCtrl(myName, 'right')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'right',
              actionUser: myName
            })
          }
        },
        function() {
          that.walkCtrl(myName, 'stop')
          socket.emit('actionCtrl', {
            actionName: 'walk',
            actionValue: 'stop',
            actionUser: myName
          })
          keyboardJS.pressKey('down')
        }
      )

      keyboardJS.bind(
        'left > right',
        function(e) {
          if (!e.repeat) {
            that.walkCtrl(myName, 'stop')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'stop',
              actionUser: myName
            })
            that.walkCtrl(myName, 'right')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'right',
              actionUser: myName
            })
          }
          // that.walkCtrl(myName, 'right')
        },
        function() {
          that.walkCtrl(myName, 'stop')
          socket.emit('actionCtrl', {
            actionName: 'walk',
            actionValue: 'stop',
            actionUser: myName
          })
        }
      )

      keyboardJS.bind(
        'right > left',
        function(e) {
          if (!e.repeat) {
            that.walkCtrl(myName, 'stop')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'stop',
              actionUser: myName
            })
            that.walkCtrl(myName, 'left')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'left',
              actionUser: myName
            })
          }
        },
        function() {
          that.walkCtrl(myName, 'stop')
          socket.emit('actionCtrl', {
            actionName: 'walk',
            actionValue: 'stop',
            actionUser: myName
          })
        }
      )

      keyboardJS.bind('left > space', function(e) {
        that.jumpCtrl(myName)
        socket.emit('actionCtrl', {
          actionName: 'jump',
          actionValue: '',
          actionUser: myName
        })
      })

      keyboardJS.bind('right > space', function(e) {
        that.jumpCtrl(myName)
        socket.emit('actionCtrl', {
          actionName: 'jump',
          actionValue: '',
          actionUser: myName
        })
      })

      keyboardJS.bind(
        'right > down',
        function(e) {
          if (!e.repeat) {
            that.walkCtrl(myName, 'stop')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'stop',
              actionUser: myName
            })
            that.changeRoleState(myName, 1)
            socket.emit('actionCtrl', {
              actionName: 'down',
              actionValue: 'down',
              actionUser: myName
            })
          }
        },
        function() {
          that.changeRoleState(myName, 0)
          socket.emit('actionCtrl', {
            actionName: 'down',
            actionValue: 'up',
            actionUser: myName
          })
        }
      )

      keyboardJS.bind(
        'left > down',
        function(e) {
          if (!e.repeat) {
            that.walkCtrl(myName, 'stop')
            socket.emit('actionCtrl', {
              actionName: 'walk',
              actionValue: 'stop',
              actionUser: myName
            })
            that.changeRoleState(myName, 1)
            socket.emit('actionCtrl', {
              actionName: 'down',
              actionValue: 'down',
              actionUser: myName
            })
          }
        },
        function() {
          that.changeRoleState(myName, 0)
          socket.emit('actionCtrl', {
            actionName: 'down',
            actionValue: 'up',
            actionUser: myName
          })
        }
      )

      //虚拟键操控
      // $('.gb-container').on('touchstart', '.ctrl-item', function(e) {
      //   console.log(e)
      //   var ctrlName = e.target.className.split(' ')[1]
      //   switch (ctrlName) {
      //     case 'left':
      //       isWalk = true
      //       that.walkCtrl(myName, 'left')
      //       socket.emit('actionCtrl', {
      //         actionName: 'walk',
      //         actionValue: 'left',
      //         actionUser: myName
      //       })
      //       break
      //     case 'right':
      //       isWalk = true
      //       that.walkCtrl(myName, 'right')
      //       socket.emit('actionCtrl', {
      //         actionName: 'walk',
      //         actionValue: 'right',
      //         actionUser: myName
      //       })
      //       break
      //     case 'bottom':
      //       changeRoleState(myName, 1)
      //       socket.emit('actionCtrl', {
      //         actionName: 'down',
      //         actionValue: 'down',
      //         actionUser: myName
      //       })
      //       break
      //     case 'A':
      //       jumpCtrl(myName)
      //       socket.emit('actionCtrl', {
      //         actionName: 'jump',
      //         actionValue: '',
      //         actionUser: myName
      //       })
      //       break
      //     case 'B':
      //       jumpCtrl(myName)
      //       socket.emit('actionCtrl', {
      //         actionName: 'jump',
      //         actionValue: '',
      //         actionUser: myName
      //       })
      //       break
      //   }
      // })
      // $('.gb-container').on('touchend', '.ctrl-item', function(e) {
      //   console.log(e)
      //   var ctrlName = e.target.className.split(' ')[1]
      //   switch (ctrlName) {
      //     case 'left':
      //       isWalk = false
      //       that.walkCtrl(myName, 'stop')
      //       socket.emit('actionCtrl', {
      //         actionName: 'walk',
      //         actionValue: 'stop',
      //         actionUser: myName
      //       })
      //       break
      //     case 'right':
      //       isWalk = false
      //       that.walkCtrl(myName, 'stop')
      //       socket.emit('actionCtrl', {
      //         actionName: 'walk',
      //         actionValue: 'stop',
      //         actionUser: myName
      //       })
      //       break
      //     case 'bottom':
      //       changeRoleState(myName, 0)
      //       socket.emit('actionCtrl', {
      //         actionName: 'down',
      //         actionValue: 'up',
      //         actionUser: myName
      //       })
      //       break
      //   }
      // })
    },
    chatToBottom() {
      // $('.chat-list').scrollTop(100000000000000)
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-container {
  background: rgba(#fff, 0.8);
  padding: 20px;
  overflow-y: auto;
  .chat-main {
    padding: 20px;
    min-height: 100%;
    background: #fff;
    padding-top: 20px;
    width: 840px;
    margin: 0 auto;
    border-radius: 8px;
    .tip {
      font-size: 14px;
      padding: 10px 0;
      span {
        display: inline-block;
        border: 1px solid #e5e5e5;
        font-size: 10px;
        color: #999;
        padding: 4px;
        line-height: 1;
        border-radius: 5px;
        margin: 0 5px;
        box-shadow: 0 0 5px rgba(#ccc, 0.5);
        &.down {
          padding: 4px 7px;
        }
        &:first-child {
          margin-right: 0;
        }
      }
    }
  }
  #stage {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    display: block;
    background: url('https://fmcat-common-static.oss-cn-hangzhou.aliyuncs.com/chat/bg.png');
    border-radius: 8px;
  }
  .join-chat {
    padding-top: 15px;
    display: flex;
    align-items: center;
    .left {
      flex: 1;
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      .name-input {
        margin-bottom: 10px;
        input {
          text-align: center;
        }
      }
    }
    .right {
      flex: 5.5;
      flex-shrink: 0;
      overflow-x: auto;
      white-space: nowrap;
      .item {
        display: inline-block;
        img {
          user-select: none;
        }
      }
    }
  }
}
.swiper-item {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 10px;
  height: 100px;
  border-radius: 15px;
  border: 1px solid #e5e5e5;
  &:hover,
  &.active {
    border-color: #67c23a;
  }
}
.input-focus {
  // opacity: 0;
  position: relative;
  z-index: -1;
  height: 0;
}
</style>