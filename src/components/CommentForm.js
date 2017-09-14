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
  }

  render(){
    const {comment,savingComment,dispatch,postId} = this.props;
    return (
    <form noValidate onSubmit={this.handleCommentSubmit}>
      <input type="hidden" name="timestamp" defaultValue={Date.now()} />
      <input type="hidden" name="parentId" defaultValue={postId} />
      <input type="text" required name="author" defaultValue={comment && comment.author || "" }  placeholder="author"/>
      <textarea required placeholder="Comment" name="body"></textarea>
      {comment && comment.id ? <input type="hidden" defaultValue={comment.id} name="id" />:""}
      {savingComment ?
        <Loading delay={200} type='spin' color='#222' className='loading' />
        :  <input formNoValidate type="Submit" defaultValue="Save" />
      }
    </form>
  )
  }
}

export default connect()(CommentForm);
