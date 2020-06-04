import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addCommentt } from '../../actions/post'

export const CommentForm = ({ postId, addCommentt }) => {

   const [text, setText] = useState('')

   return (
      <div class="post-form">
         <div class="bg-primary p">
            <h3>Leave a Comment</h3>
         </div>
         <form class="form my-1" onSubmit={e => {
            e.preventDefault();
            addCommentt(postId, { text })
            setText('')
         }}>
            <textarea
               name="text"
               cols="30"
               rows="5"
               placeholder="Create a post"
               value={text}
               onChange={e => setText(e.target.value)}
               required
            ></textarea>
            <input type="submit" class="btn btn-dark my-1" value="Submit" />
         </form>
      </div>
   )
}

export default connect(null, { addCommentt })(CommentForm)
