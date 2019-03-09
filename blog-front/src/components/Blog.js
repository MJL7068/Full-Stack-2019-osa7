import React from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, like, remove, creator }) => {
  const details = () => (
    <div className='details'>
      <a href={blog.url}>{blog.url}</a>
      <div>{blog.likes} likes
        <button onClick={() => like(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {creator &&(<button onClick={() => remove(blog)}>remove </button>)}
    </div>
  )

  const comments = () => (
    <div>
      <h3>comments</h3>
      <ul>
        {blog.comments.map(comment =>
          <li key={comment.id}>{comment.content}</li>
        )}
      </ul>
    </div>
  )

  return (
    <div>
      <h1>{blog.title}</h1>
      {details()}
      {comments()}
    </div>
  )
}


Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  creator: PropTypes.bool.isRequired
}

export default Blog