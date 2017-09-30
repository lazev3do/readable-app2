import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import Post from './Post'
import {orderBy} from '../actions'
import sortBy from 'sort-by'
import MdAdd from 'react-icons/lib/md/add'

/*
**
 title, author, number of comments, current score, and a voting mechanism to upvote or downvote the post. Posts should have buttons or links for editing or deleting that post.
*/
class PostList extends Component {
  render () {
    const {posts,dispatch,postsOrderBy} = this.props;
    return (
      <div className="col-xs-12">
        <h3>Posts</h3>
        <div className="row">
          <div className="radio form-group col-xs-6 col-sm-4">
            <label>
              <input type="radio"  defaultChecked={postsOrderBy=="voteScore"} name="orderBy" onClick={event=>dispatch(orderBy("voteScore"))} />Order by score
            </label>
          </div>
          <div className="radio form-group col-xs-6 col-sm-4">
            <label>
              <input type="radio" defaultChecked={postsOrderBy=="timestamp"} name="orderBy" onClick={event=>dispatch(orderBy("timestamp"))} />Order by date
            </label>
          </div>
        </div>
        <Link className="btn btn-sm btn-primary" to={`/posts/new_post`}><MdAdd/>Add Post</Link>
        <ul className="list-unstyled post">
          {posts.filter((element,index)=>!element.deleted).sort(sortBy(`-${postsOrderBy}`)).map(post=>(
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
