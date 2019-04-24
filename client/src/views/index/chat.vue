<template>
  <div class="chat-container">
    <div class="chat-main">
      <canvas id="stage"></canvas>
      <div class="join-chat">
        <div class="left">
          <el-input v-model="joinName" placeholder="输入昵称" class="name-input"></el-input>
          <el-button type="success">加入聊天</el-button>
        </div>
        <div class="right"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Wait from '../../components/Wait'
let W = 800,
  H = 600
let roles = {}
let images = {}
let myName = ''
let isWalk = false
let timers = {}
let roleImages = []
let chatStorage = []
export default {
  data() {
    return {
      context: null,
      joinName: ''
    }
  },
  components: {
    Wait
  },
  created() {
    console.log(this.$socket)
    if (this.$socket.connected) {
      console.log(this.$socket.id)
      console.log('%c已连接到花喵聊天室', 'color:#fff;background:#46bd87;padding:4px 8px;border-radius: 4px;')
      this.$socket.emit('reGetUser')
    }
  },
  sockets: {
    connect() {
      console.log(this.$socket.id)
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
      console.log(data)
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
        alert(r.msg)
      } else {
        roles[r.data.name] = r.data
      }
    },
    userJoin(r) {
      if (r.code === 0) {
        console.log(r.msg)
      } else {
        myName = r.data.name
        myRole = r.data
        roles[r.data.name] = r.data
        this.roleKeyBind(myName, this.$socket)
        $('.join-box')
          .add('.mask-layer')
          .remove()
        $('#jiaodian').focus()
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
    console.log(context)
    that.$axios('https://chat.fmcat.top/getResources').then(r => {
      console.log(r)
      var imgs = r.data.imgs
      var promises = []
      if (r.status === 200) {
        for (var i = 0; i < imgs.length; i++) {
          promises.push(that.loadImages(imgs[i]))
        }
      }
      Promise.all(promises).then(function(results) {
        console.log('资源加载完成')
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
            socket.emit('positionSync', {
              position_x: roles[myName].state.x,
              actionUser: myName
            })
          }
        }, 1000 / 24)
      })
    })

    console.log(images)
  },
  methods: {
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
    emitChat(myName, content, socket) {
      window.clearTimeout(timers[myName + 'chat'])
      roles[myName].chatText = content
      socket.emit('userChat', {
        userName: myName,
        chatText: content
      })
      timers[myName + 'chat'] = setTimeout(function() {
        roles[myName].chatText = ''
        socket.emit('userChat', {
          userName: myName,
          chatText: ''
        })
      }, 5000)
      $('#jiaodian').focus()
      $('#chat').val('')
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
      if (state == 0) {
        console.log('站')
        speed = 500
        roles[roleanme].state.imageIndex = 0
        fun = function() {
          if (index == rule.length) {
            index = 0
          }
          roles[roleanme].state.imageIndex = rule[index++]
        }
      } else if (state == 1) {
        console.log('趴')
        speed = 0
        fun = function() {
          index = 0
          roles[roleanme].state.imageIndex = 8
        }
      } else if (state == 2) {
        console.log('走')
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
        console.log('跳')
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
      keyboardJS.watch($('#jiaodian')[0])
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
            changeRoleState(myName, 1)
            socket.emit('actionCtrl', {
              actionName: 'down',
              actionValue: 'down',
              actionUser: myName
            })
          }
        },
        function() {
          this.changeRoleState(myName, 0)
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
            this.changeRoleState(myName, 1)
            socket.emit('actionCtrl', {
              actionName: 'down',
              actionValue: 'down',
              actionUser: myName
            })
          }
        },
        function() {
          this.changeRoleState(myName, 0)
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
            this.changeRoleState(myName, 1)
            socket.emit('actionCtrl', {
              actionName: 'down',
              actionValue: 'down',
              actionUser: myName
            })
          }
        },
        function() {
          this.changeRoleState(myName, 0)
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
  .chat-main {
    padding: 20px;
    min-height: 100%;
    background: #fff;
    padding-top: 20px;
    width: 840px;
    margin: 0 auto;
    border-radius: 8px;
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
    }
  }
}
</style>