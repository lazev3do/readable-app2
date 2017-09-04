import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import {vote} from '../actions'

/*
**
 title, author, number of comments, current score, and a voting mechanism to upvote or downvote the post. Posts should have buttons or links for editing or deleting that post.
*/
class Voting extends Component {

  componentDidMount () {
  }

  render () {
    const {post,isVoting,dispatch} = this.props;
    return (
      <div>
        <span>{post.voteScore}</span>
        <button onClick={(event)=>dispatch(vote(post.id,'upVote'))}>+</button>
        <button  onClick={(event)=>dispatch(vote(post.id,'downVote'))}>-</button>
        {isVoting &&
        <Loading delay={200} type='spin' color='#222' className='loading' />
        }
      </div>
    )
  }
}

const mapStateToProps = ({posts}) =>
{
  return {isVoting:posts.isVoting};
}

export default connect(mapStateToProps)(Voting);
