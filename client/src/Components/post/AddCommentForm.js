import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addComment } from '../../actions/post'

export const AddCommentForm = ({ postid, addComment }) => {

   const [text, setText] = useState('')

   const formSubmit = e => {
      addComment(postid, { text })
      setText('')
   }
   return (
      <div className="post-form">
         <div className="bg-primary p">
            <h3>Leave A Comment</h3>
         </div>
         <form className="form my-1" onSubmit={formSubmit}>
            <textarea
               name="text"
               cols="30"
               rows="5"
               placeholder="Comment on this post"
               value={text}
               onChange={e => setText(e.target.value)}
               required
            ></textarea>
            <input type="submit" className="btn btn-dark my-1" value="Submit" />
         </form>
      </div>
   )
}

export default connect(null, { addComment })(AddCommentForm)