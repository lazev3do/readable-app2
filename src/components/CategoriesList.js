import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {fetchCategories} from '../actions'
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'

class CategoriesList extends Component {

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchCategories());
  }

  render () {
    const {isFetchingCategories,entries} = this.props;
    return (
      <div>
      {isFetchingCategories === true
           ? <Loading delay={200} type='spin' color='#222' className='loading' />
         :
          <ul>
            {entries.map((entry,index)=>(
              <li key={`link_${index}`}>
                <Link to={`/${entry.path}`} className="close-search">{entry.name}</Link>
              </li>
            ))}
          </ul>
     }
   </div>
    )
  }
}

function mapStateToProps ({categories}) {
  const {isFetchingCategories,entries} = categories;
  return {isFetchingCategories,entries};
}

export default connect(mapStateToProps)(CategoriesList);
