import blogsService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BLOG':
      return [...state, action.data].sort((b1, b2) => b2.likes - b1.likes)
    case 'INIT_BLOGS':
      state = action.data
      return action.data
    case 'DELETE_BLOG':
      return state.filter(blog => blog.id !== action.data.id).sort((b1, b2) => b2.likes - b1.likes)
    case 'LIKE_BLOG':
      return state.map(blog => blog.id === action.data.id ? action.data : blog)
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogsService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs.sort((a, b) => b.likes - a.likes)
    })
  }
}

export const createNewBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogsService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    await blogsService.remove(blog)
    dispatch({
      type: 'DELETE_BLOG',
      data: blog
    })
  }
}

export const LikeABlog = (blog) => {
  return async dispatch => {
    const blogObject = {
      ...blog,
      likes: blog.likes + 1
    }
    const updatedBlog = await blogsService.update(blogObject)
    dispatch({
      type: 'LIKE_BLOG',
      data: updatedBlog
    })
  }
}

export default reducer