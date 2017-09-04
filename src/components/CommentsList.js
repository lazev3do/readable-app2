import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import {orderByComments} from '../actions'
import sortBy from 'sort-by'

class CommentsList extends Component {

  render(){
    const {comments,dispatch,commentsOrderBy} = this.props;
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
          <span key={`body_${element.id}`}>{element.body}</span>
        </li>
      ))}
      </ul>
      </div>
    )
  }

}

const mapStateToProps = (state,ownProps) => ({
  comments:state.posts.comments[ownProps.postId],
  commentsOrderBy:state.posts.commentsOrderBy
})

export default connect(mapStateToProps)(CommentsList);
