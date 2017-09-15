import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import {vote} from '../actions'
import MdKeyboardArrowUp from 'react-icons/lib/md/keyboard-arrow-up'
import MdKeyboardArrowDown from 'react-icons/lib/md/keyboard-arrow-down'



/*
**
 title, author, number of comments, current score, and a voting mechanism to upvote or downvote the post. Posts should have buttons or links for editing or deleting that post.
*/
class Voting extends Component {

  componentDidMount () {
  }

  render () {
    const {postOrComment,isVoting,dispatch,type} = this.props;
    return (
      <div>
        <span>{postOrComment.voteScore} (vote score)</span>
        <button className="vote-button btn btn-outline-success btn-sm" onClick={(event)=>dispatch(vote(postOrComment.id,'upVote',type))}><MdKeyboardArrowUp/></button>
        <button className="vote-button btn btn-outline-danger btn-sm"  onClick={(event)=>dispatch(vote(postOrComment.id,'downVote',type))}><MdKeyboardArrowDown/></button>
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
