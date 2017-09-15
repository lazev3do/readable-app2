import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import {orderByComments,saveComment} from '../actions'
import {guid} from '../utils/helper'
import serializeForm from 'form-serialize'
import sortBy from 'sort-by'

class CommentForm extends Component {
  handleCommentSubmit = (e) => {
    e.preventDefault();
    const values = serializeForm(e.target,{hash:true});
    values.existing_comment = values.id!==undefined;
    if(!values.existing_comment)
    {
      values.id = guid();
    }
    this.props.dispatch(saveComment(values));
    e.target.reset();
  }

  render(){
    const {comment,savingComment,dispatch,postId} = this.props;
    return (
    <form onSubmit={this.handleCommentSubmit}>
      <h4>Add Comment:</h4>
      <input type="hidden" name="timestamp" defaultValue={Date.now()} />
      <input type="hidden" name="parentId" defaultValue={postId} />
      <input type="hidden" name="action" defaultValue="saveAction" ref={(input)=>this.actionInput=input} />
      <div className="form-group" style={{marginTop:"10px"}}>
        <label htmlFor="comment_author">Author</label>
        <input id="comment_author" className="form-control" type="text" required name="author" defaultValue={comment && comment.author || "" }  placeholder="author"/>
      </div>
      <div className="form-group">
        <label htmlFor="comment_body">Comment:</label>
        <textarea id="comment_body" className="form-control" required placeholder="Comment" name="body" defaultValue={comment && comment.body || "" }></textarea>
      </div>
      <div>
        {savingComment ?
          <Loading delay={200} type='spin' color='#222' className='loading' />
          :  <input style={{marginRight:"10px"}} className="btn btn-primary" onClick={()=>{this.actionInput.value="saveAction";return true;}} type="Submit" defaultValue="Save" />
        }
        {comment && comment.id &&
        <div style={{display:"inline-block"}}>
          <input formNoValidate className="btn btn-small btn-danger" onClick={()=>{this.actionInput.value="deleteAction";return true;}} type="Submit" defaultValue="Delete" />
          <input type="hidden" defaultValue={comment.id} name="id" />
        </div>
        }
      </div>
    </form>
  )
  }
}

export default connect()(CommentForm);
