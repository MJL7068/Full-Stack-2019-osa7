import React from 'react'
import PropTypes from 'prop-types'
import { useField } from '../hooks'

const Blog = ({ blog, like, remove, creator, createComment }) => {
  const [comment, commentReset] = useField('text')

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

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('comment')
    console.log(comment)
    createComment({
      content: comment.value,
      blog: blog.id
    })
    commentReset()
  }

  const comments = () => (
    <div>
      <h3>comments</h3>
      <div>
      <form onSubmit={handleSubmit}>
        <input {...comment} />
        <button type="submit">add comment</button>
      </form>
    </div>
      <ul>
        {blog.comments.map(comment =>
          <li key={comment.content}>{comment.content}</li>
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