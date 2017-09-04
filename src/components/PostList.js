import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import Post from './Post'
import {orderBy} from '../actions'
import sortBy from 'sort-by'
import {editMode,fetchCategories} from '../actions'

/*
**
 title, author, number of comments, current score, and a voting mechanism to upvote or downvote the post. Posts should have buttons or links for editing or deleting that post.
*/
class PostList extends Component {

  componentDidMount () {
  }

  render () {
    const {posts,dispatch,postsOrderBy} = this.props;
    return (
      <div>
        <label>
          <input type="radio" name="orderBy" onClick={event=>dispatch(orderBy("timestamp"))} />Order by date
        </label>
        <label>
          <input type="radio" name="orderBy" onClick={event=>dispatch(orderBy("voteScore"))} />Order by score
        </label>
        <Link to={`/posts/new_post`}>Add Post</Link>
        <ul>
          {posts.sort(sortBy(postsOrderBy)).map(post=>(
            <li key={`post_${post.id}`}>
              <Post post_id={post.id} showlistview={true}/>
            </li>
          ))}
        </ul>
   </div>
    )
  }
}

function mapStateToProps ({posts}) {
  return {posts:posts.posts,postsOrderBy:posts.orderBy || "voteScore"};
}

export default connect(mapStateToProps)(PostList);
