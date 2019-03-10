import React from 'react'
import {Navbar} from 'react-bootstrap/Navbar'
import {Link} from 'react-bootstrap/NavLink'

const NavigationBar = ({user}) => {
  const padding = {
    paddingRight: 5
  }

  return (
    <div>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Navbar className="mr-auto">
        <Navbar.Link href="#" as="span">
          <Link style={padding} to="/">home</Link>
        </Navbar.Link>
        <Navbar.Link href="#" as="span">
          <Link style={padding} to="/notes">notes</Link>
        </Navbar.Link>
        <Navbar.Link href="#" as="span">
          <Link style={padding} to="/users">users</Link>
        </Navbar.Link>
        <Navbar.Link href="#" as="span">
          {user
            ? <em>{user} logged in</em>
            : <Link to="/login">login</Link>
          }
      </Navbar.Link>
      </Navbar>
    </Navbar.Collapse>
  </Navbar>
  </div>
  )
}

export default NavigationBar