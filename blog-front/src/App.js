import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route, Link, Redirect, withRouter
} from 'react-router-dom'
import { connect } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useField } from './hooks'
import { initializeBlogs, createNewBlog, deleteBlog, LikeABlog } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { initializeUser, login } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'

const App = (props) => {
  const [username] = useField('text')
  const [password] = useField('password')
  const [user, setUser] = useState(null)

  /*useEffect(() => {
    props.initializeUsers()
  }, [])*/

  useEffect(() => {
    props.initializeBlogs()
    props.initializeUsers()
  }, [])

  /*
  useEffect(() => {
    props.initializeUser()
  }, [])
  */

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Menu = () => {
    const padding = {
      paddingRight: 5
    }

    return(
      <div>
        <Router>
          <div>
            <div>
              
            </div>
            <Route exact path='/' render={() => <Blogs />} />
            <Route path='/users' render={() => <Users />} />
          </div>
        </Router>
      </div>
    )
  }

  const Blogs = () => {
    return(
      <div>
      <Togglable buttonLabel='create new' ref={newBlogRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>

        {props.blogs.sort(byLikes).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            like={likeBlog}
            remove={removeBlog}
            user={user}
            creator={blog.user.username === user.username}
          />
        )}
      </div>
    )
  }

  const Users = () => {
    return(
      <div>
        <h2>Users</h2>
        {props.users.map(user =>  
          <p key={user.id}>{user.username} {user.name} {user.blogs.length}</p>
        )}
      </div>
    )
  }

  const notify = (message, type = 'success') => {
    props.setNotification(message, type, 10000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    //props.login(event)
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      notify('wrong username of password', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.destroyToken()
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const createBlog = async (blog) => {
    props.createNewBlog(blog)
    notify(`a new blog ${blog.title} by ${blog.author} added`)
  }

  const likeBlog = async (blog) => {
    props.LikeABlog(blog)
    notify(`blog ${blog.title} by ${blog.author} liked!`)
  }

  const removeBlog = async (blog) => {
    const ok = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      props.deleteBlog(blog)
      notify(`blog ${blog.title} by ${blog.author} removed!`)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification />

        <form onSubmit={handleLogin}>
          <div>
            käyttäjätunnus
            <input name="username" {...username} />
          </div>
          <div>
            salasana
            <input type="password" name="password" {...password} />
          </div>
          <button type="submit">kirjaudu</button>
        </form>
      </div>
    )
  }

  const newBlogRef = React.createRef()

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <Menu />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    users: state.users,
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  initializeUser,
  initializeUsers,
  login,
  createNewBlog,
  deleteBlog,
  LikeABlog,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)