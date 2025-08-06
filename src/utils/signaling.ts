import * as map from 'lib0/map'

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1

const pingTimeout = 30000

const topics = new Map<String, Set<any>>()

type Ws = Bun.ServerWebSocket<{ 
  subscribedTopics: Set<String>;
  pongReceived: boolean;
  closed: boolean;
}>

export const send = (ws: Ws, message: any) => {
  if (ws.readyState !== wsReadyStateConnecting && ws.readyState !== wsReadyStateOpen) {
    ws.close()
  }
  try {
    ws.send(JSON.stringify(message))
  } catch (e) {
    ws.close()
  }
}

export const fetch = (request: Request, server: Bun.Server) => {
  const subscribedTopics = new Set<String>()
  let closed = false
  let pongReceived = true

  server.upgrade(request, { data: { 
    subscribedTopics,
    closed,
    pongReceived
  } 
  })

}

export const open = (ws: Ws) => {
  const pingInterval = setInterval(() => {
    if (!ws.data.pongReceived) {
      ws.close()
      clearInterval(pingInterval)
    } else {
      ws.data.pongReceived = false
      try {
        ws.ping()
      } catch (e) {
        ws.close()
      }
    }
  }, pingTimeout)
}

export const pong = (ws: Ws) => {
  ws.data.pongReceived = true
}

export const close = (ws: Ws) => {
  ws.data.subscribedTopics.forEach(topicName => {
    const subs = topics.get(topicName) || new Set()
    subs.delete(ws)
    if (subs.size === 0) {
      topics.delete(topicName)
    }
  })
  ws.data.subscribedTopics.clear()
  ws.data.closed = true
}

export const message = (ws: Ws, msg: string | Buffer<ArrayBufferLike>) => {
  if (typeof msg !== 'string') {
    throw new Error("only support string messages now");
  }

  const message = JSON.parse(msg)

  if (message && message.type && !ws.data.closed) {
    switch (message.type) {
      case 'subscribe':
          /** @type {Array<string>} */ (message.topics || []).forEach((topicName: String) => {
        if (typeof topicName === 'string') {
          // add conn to topic
          const topic = map.setIfUndefined(topics, topicName, () => new Set())
          topic.add(ws)
          // add topic to conn
          ws.data.subscribedTopics.add(topicName)
        }
      })
        break
      case 'unsubscribe':
          /** @type {Array<string>} */ (message.topics || []).forEach((topicName: String) => {
        const subs = topics.get(topicName)
        if (subs) {
          subs.delete(ws)
        }
      })
        break
      case 'publish':
        if (message.topic) {
          const receivers = topics.get(message.topic)
          if (receivers) {
            message.clients = receivers.size
            receivers.forEach(receiver =>
              send(receiver, message)
            )
          }
        }
        break
      case 'ping':
        send(ws, { type: 'pong' })
    }
  }
}

