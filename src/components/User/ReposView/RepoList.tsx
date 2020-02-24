import React from 'react'
import { connect } from 'react-redux'
import { Typography, ButtonGroup, Button, Divider, makeStyles } from '@material-ui/core'

import { State, RepoProps, ReposIdsPage, reposSelectors } from 'state'
import { appConfig } from 'config'

import RepoCard from './RepoCard'

const { getReposIdsPage } = reposSelectors

const useStyles = makeStyles(theme => ({
  paginationInfo: {
    padding: theme.spacing(appConfig.padding.repoListItem)
  },
  list: {
    paddingBottom: theme.spacing(5)
  },
  buttonGroup: {
    margin: 'auto'
    // paddingLeft: '30%',
    // paddingRight: '30%'
  }
}))

interface StateProps {
  idsPage: ReposIdsPage
}

interface OwnProps extends RepoProps {
  onPrevClick: () => void
  onNextClick: () => void
}

type RepoListProps = StateProps & OwnProps

const RepoList: React.FC<RepoListProps> = ({
  idsPage: { ids, from, to, hasPrevPage, hasNextPage },
  onPrevClick,
  onNextClick
}) => {
  const styles = useStyles()

  const hasOtherPages = hasPrevPage || hasNextPage

  return (
    <>
      {hasOtherPages && (
        <Typography variant="body2" className={styles.paginationInfo}>
          Showing {from + 1} to {to}
        </Typography>
      )}
      <ul className={styles.list}>
        {ids.map(repoId => (
          <li key={repoId}>
            <RepoCard id={repoId} />
            <Divider />
          </li>
        ))}
      </ul>
      {hasOtherPages && (
        <ButtonGroup fullWidth={true} className={styles.buttonGroup}>
          <Button disabled={!hasPrevPage} onClick={hasPrevPage ? onPrevClick : undefined}>
            Previous
          </Button>
          <Button disabled={!hasNextPage} onClick={hasNextPage ? onNextClick : undefined}>
            Next
          </Button>
        </ButtonGroup>
      )}
    </>
  )
}

export default connect<StateProps, {}, OwnProps, State>((state, props) => ({
  idsPage: getReposIdsPage(state, props)
}))(RepoList)
