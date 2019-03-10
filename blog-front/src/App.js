import React, { useState, useEffect } from 'react'
import { Table, Navbar, Nav } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Route, Link, Redirect, withRouter
} from 'react-router-dom'
import { connect } from 'react-redux'
import Blog from './components/Blog'
//import NavigationBar from './components/NavigationBar'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useField } from './hooks'
import { initializeBlogs, createNewBlog, deleteBlog, LikeABlog, addComment } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { initializeUser, login } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'

const App = (props) => {
  const [username] = useField('text')
  const [password] = useField('password')
  const [user, setUser] = useState(null)

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

    return(
      <div>
        <Router>
          <div>
            <div>
              
            </div>
            <Route exact path='/' render={() => <Blogs />} />
            <Route path='/users' render={() => <Users />} />
            <Route exact path='/users/:id' render={({ match }) =>
              <User user={userById(match.params.id)} />
            } />
            <Route path='/blogs/:id' render={({ match }) => {
              if (user === undefined) {
                return null
              }

              return(
              <Blog
              blog={blogById(match.params.id)}
              like={likeBlog}
              remove={removeBlog}
              user={user}
              creator={blogById(match.params.id).user.username === user.username}
              createComment={createComment}
              />
              )
            }
            } />
          </div>
        </Router>
      </div>
    )
  }

  const Blogs = () => {
    const padding = {
      paddingRight: 5
    }

    return(
      <div>
      <Togglable buttonLabel='create new' ref={newBlogRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      {props.blogs.sort(byLikes).map(blog => 
        <p key={blog.id} style={padding}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </p>
      )}
        
      </div>
    )
  }

  const Users = () => {
    return(
      <div>
        <h2>Users</h2>
        <Table>
          <tbody>
            <tr>
              <td></td><td>blogs created</td>
            </tr>
            {props.users.map(user =>  
              <tr key={user.id}>
                <td>{user.username} <Link to={`/users/${user.id}`}>{user.name}</Link></td> 
                <td>{user.blogs.length}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }

  const User = ({user}) => {
    if (user === undefined) {
      return null
    }

    return(
      <div>
        <h1>{user.name}</h1>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map(blog => 
            <li key={blog.id}>{blog.title}</li>
          )}
        </ul>
      </div>
    )
  }

  const NavigationBar = () => {
    const padding = {
      paddingRight: 5
    }

    return(
      <Router>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/">home</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/notes">notes</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/users">users</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        {user
          ? <em>{user} logged in</em>
          : <Link to="/login">login</Link>
        }
    </Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
</Router>
    )
  }

  const userById = (id) =>
    props.users.find(user => user.id === id)

  const blogById = (id) =>
    props.blogs.find(blog => blog.id === id)

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

  const createComment = async (comment) => {
    console.log('app comment-object')
    console.log(comment)
    props.addComment(comment)
    notify(`a new comment ${comment.content} added`)
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
    <div className="container">
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
  addComment,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)