import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import {orderByComments,editComment} from '../actions'
import sortBy from 'sort-by'
import CommentForm from './CommentForm'
import Voting from './Voting'

class CommentsList extends Component {
  editComment = (id) => {
    this.props.dispatch(editComment(id));
  }

  render(){
    const {comments,dispatch,commentsOrderBy,editAddComment,commentToEdit,postId} = this.props;
    return (
      <div>
        <div className="row">
          <div className="form-check radio col-xs-6 col-sm-4">
            <label className="form-check-label">
              <input className="form-check-input" defaultChecked={commentsOrderBy==="voteScore"} type="radio" name="orderBy" onClick={event=>dispatch(orderByComments("voteScore"))} />Order by score
            </label>
          </div>
          <div className="form-check radio col-xs-6 col-sm-4">
            <label className="form-check-label">
              <input className="form-check-input" defaultChecked={commentsOrderBy==="timestamp"} type="radio" name="orderBy" onClick={event=>dispatch(orderByComments("timestamp"))} />Order by date
            </label>
          </div>
        </div>
        <ul className="list-unstyled post col-xs-12">
        {comments.filter(element=>!element.deleted).sort(sortBy(`-${commentsOrderBy}`)).map((element,index)=>(
            <li key={element.id}>
              {commentToEdit!==null && commentToEdit==element.id ?
              <CommentForm postId={postId} key={element.id} comment={element} />
              :
              <div>
                <Voting postOrComment = {element} type="comments" />
                <blockquote className="blockquote">
                  <p className="mb-0">{element.body}</p>
                </blockquote>
                <p>{element.author}</p>
                <button className="btn btn-small btn-info" style={{marginBottom:"10px"}} onClick={()=>this.editComment(element.id)}>Edit Comment</button>
              </div>
            }
            </li>
        ))}
        </ul>
      </div>
    )
  }

}

const mapStateToProps = ({posts},ownProps) => ({
  comments:posts.comments[ownProps.postId],
  commentsOrderBy:posts.commentsOrderBy || "voteScore",
  commentToEdit:posts.commentToEdit || null
})

export default connect(mapStateToProps)(CommentsList);
