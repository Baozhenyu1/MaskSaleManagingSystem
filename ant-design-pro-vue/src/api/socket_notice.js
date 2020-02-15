import user from "@/store/modules/user.js"

let websock = null
let globalCallback = null
let tmpMsg = []

// 初始化weosocket
function initWebSocket() {
  // ws地址 -->这里是你的请求路径
  let ws = 'ws://111.231.88.241:4567/w_message'

  if (user.state.token) {
    websock = new WebSocket(ws)

    //console.log("init socket")
    //console.log(user.state.token)

    websock.onmessage = function (e) {
      websocketonmessage(e)
    }
    websock.onclose = function (e) {
      websocketclose(e)
    }
    websock.onopen = function () {
      websocketOpen()
    }

    // 连接发生错误的回调方法
    websock.onerror = function () {
      console.log('WebSocket连接发生错误')
    }
  } else {
    setTimeout(function () {
      //console.log("Waiting for login")
      //console.log(user.state.token)
      initWebSocket()
    }, 100)
  }
}

// 实际调用的方法
function sendSock(agentData, callback) {
  //console.log("in sendsock")

  if (websock) {
    //console.log(user.state.token)
    globalCallback = callback
    if (websock.readyState === websock.OPEN) {
      // 若是ws开启状态
      websocketsend(agentData)
    } else if (websock.readyState === websock.CONNECTING) {
      // 若是 正在开启状态，则等待1s后重新调用
      setTimeout(function () {
        sendSock(agentData, callback)
      }, 1000)
    } else {
      // 若未开启 ，则等待1s后重新调用
      setTimeout(function () {
        sendSock(agentData, callback)
      }, 1000)
    }
  } else {
    setTimeout(function () {
      //console.log("Waiting for ws")
      sendSock(agentData, callback)
    }, 100)
  }


}

// 数据接收
function websocketonmessage(e) {
  if (globalCallback) {
    if (tmpMsg.length != 0) {
      for (let i in tmpMsg) {
        globalCallback(tmpMsg[i])
      }
      tmpMsg = []
    }
    globalCallback(e)
  } else {
    tmpMsg.push(e)
  }
}

// 数据发送
function websocketsend(agentData) {
  websock.send(agentData)
}

// 关闭
function websocketclose(e) {
  console.log('connection closed (' + e.code + ')')
}

// 创建 websocket 连接
function websocketOpen(e) {
  console.log('连接成功')
  websocketsend("TO/" + user.state.token)
}

initWebSocket()

// 将方法暴露出去
export {
  sendSock
}