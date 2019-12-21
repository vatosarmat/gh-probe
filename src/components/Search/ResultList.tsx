import React from 'react'
import { connect } from 'react-redux'
import { List, Typography, makeStyles } from '@material-ui/core'

import { State, usersSearchSelectors } from 'state'
import { ProgressBox, ErrorBox } from 'components/common'

import ResultItem from './ResultItem'

const { getSearchQuery, getSearchError, getSearchResultIds, isSearchInProgress } = usersSearchSelectors

const useStyles = makeStyles(theme => ({
  contentList: {
    padding: theme.spacing(2)
  },

  contentEmpty: {
    padding: theme.spacing(4)
  },

  queryText: {
    wordSpacing: '.4rem'
  }
}))

interface StateProps {
  query?: string
  resultIds: number[]
  inProgress: boolean
  error?: string
}

type SearchUsersResultProps = StateProps

const SearchUsersResult: React.FC<SearchUsersResultProps> = ({ query, resultIds, inProgress, error }) => {
  const styles = useStyles()

  if (error) {
    return <ErrorBox error={error} />
  }

  if (inProgress) {
    return <ProgressBox />
  }

  if (resultIds.length) {
    return (
      <div className={styles.contentList}>
        <List>
          {resultIds.map(id => (
            <ResultItem key={id} id={id} />
          ))}
        </List>
      </div>
    )
  }

  if (query) {
    return (
      <div className={styles.contentEmpty}>
        <Typography variant="subtitle1" color="error" display="block">
          No results found for query <span className={styles.queryText}>"{query}"</span>
        </Typography>
      </div>
    )
  }

  return null
}

export default connect<StateProps, {}, {}, State>(state => ({
  query: getSearchQuery(state),
  error: getSearchError(state),
  inProgress: isSearchInProgress(state),
  resultIds: getSearchResultIds(state)
}))(SearchUsersResult)
