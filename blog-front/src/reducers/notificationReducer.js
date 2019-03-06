const initialNotification = {
  message: null,
  type: null
}

const notificationReducer = (state = initialNotification, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      state = action.data
      return state
    default:
      return state
  }
}

export const setNotification = (message, type, time) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        message: message,
        type: type
      }
    })

    setTimeout(() => {
        dispatch({
            type: 'SET_NOTIFICATION',
            data: {
              message: null,
              type: null
            }
          })
    }, time)
  }
}

export default notificationReducer