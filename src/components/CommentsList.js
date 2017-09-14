import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import {orderByComments} from '../actions'
import sortBy from 'sort-by'
import CommentForm from './CommentForm'

class CommentsList extends Component {

  render(){
    const {comments,dispatch,commentsOrderBy,editAddComment,commentToEdit,postId} = this.props;
    return (
      <div>
      <label>
        <input type="radio" name="orderBy" onClick={event=>dispatch(orderByComments("timestamp"))} />Order by date
      </label>
      <label>
        <input type="radio" name="orderBy" onClick={event=>dispatch(orderByComments("voteScore"))} />Order by score
      </label>
      <ul>
      {comments.sort(sortBy(commentsOrderBy)).map((element,index)=>(
          <li key={element.id}>
            {commentToEdit!==null && commentToEdit==element.id ?
            <CommentForm postId={postId} key={element.id} comment={element} />
            :
            <span key={`body_${element.id}`}>{element.body}</span>
          }
            <button>Edit Comment</button>
          </li>


      ))}
      </ul>
      </div>
    )
  }

}

const mapStateToProps = ({posts},ownProps) => ({
  comments:posts.comments[ownProps.postId],
  commentsOrderBy:posts.commentsOrderBy,
  commentToEdit:posts.commentToEdit || null
})

export default connect(mapStateToProps)(CommentsList);
