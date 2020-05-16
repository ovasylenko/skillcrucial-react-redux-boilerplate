export default {
  connected: (data) => ({
    type: 'SOCKET_CONNECTED',
    data
  }),
  message: (data) => {
    return JSON.parse(data)
  },
  disconnected: (data) => ({
    type: 'SOCKET_DISCONNECTED',
    data
  })
}
