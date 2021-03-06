
import React, {PropTypes, Component} from 'react'
import {connect} from './connect'
import {pathToId} from '../util/navigation'
import {createSelector, createStructuredSelector} from 'reselect'
import classNames from 'classnames'

import HubSearchResults from './hub-search-results'

import Downloads from './downloads'
import Preferences from './preferences'
import History from './history'
import FeaturedMeat from './featured-meat'
import SearchMeat from './search-meat'
import UrlMeat from './url-meat'
import Dashboard from './dashboard'
import Library from './library'

import {map} from 'underline'

export class HubMeat extends Component {
  render () {
    const {tabs} = this.props
    console.log('path = ', this.props.path)

    return <div className='hub-meat'>
      {tabs::map((tab, i) => {
        const {id, path} = tab
        const visible = (path === this.props.path)
        const classes = classNames('hub-meat-tab', {visible})
        return <div key={id || path} className={classes}>{this.renderTab(id, path)}</div>
      })}
      <HubSearchResults/>
    </div>
  }

  renderTab (tabId, path) {
    if (path === 'featured') {
      return <FeaturedMeat/>
    } else if (path === 'dashboard') {
      return <Dashboard/>
    } else if (path === 'library') {
      return <Library/>
    } else if (path === 'downloads') {
      return <Downloads/>
    } else if (path === 'history') {
      return <History/>
    } else if (path === 'preferences') {
      return <Preferences/>
    } else if (/^search/.test(path)) {
      return <SearchMeat query={pathToId(path)}/>
    } else if (/^(url|games|users|collections)/.test(path)) {
      return <UrlMeat key={tabId} tabId={tabId} path={path}/>
    } else {
      return '?'
    }
  }
}

HubMeat.propTypes = {
  path: PropTypes.string,
  me: PropTypes.object,
  games: PropTypes.object,
  myGameIds: PropTypes.array,
  downloadKeys: PropTypes.object,
  tabs: PropTypes.array
}

const allTabsSelector = createSelector(
  (state) => state.session.navigation.tabs,
  (tabs) => tabs.constant.concat(tabs.transient)
)

const mapStateToProps = createStructuredSelector({
  path: (state) => state.session.navigation.path,
  tabs: (state) => allTabsSelector(state),
  me: (state) => state.session.credentials.me
})
const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubMeat)
