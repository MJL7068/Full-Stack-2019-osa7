import blogsService from '../services/blogs'
import loginService from '../services/login'

const loginReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      state = action.data
      return state
    case 'GET_USER':
      return state
    default:
      return state
  }
}

const getUser = () => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER'
    })
  }
}

export const initializeUser = () => {
  return async dispatch => {
    const loggedUserJSON = getUser()
    console.log(loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogsService.setToken(user.token)
      //dispatch({ type: 'SET_USER', data: user })
    }
  }
}

export const login = (event) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username: event.target.username.value,
        password: event.target.password.value
      })

      blogsService.setToken(user.token)
      dispatch({ type: 'SET_USER', data: JSON.stringify(user) })
    } catch (exception) {
        dispatch({
          type: 'SET_NOTIFICATION',
          data: {
            message: 'wrong username of password',
            type: 'error'
          }
        })
    }
  }
}

export default loginReducer