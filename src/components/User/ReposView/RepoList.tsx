import React from 'react'
import { connect } from 'react-redux'
import { Typography, ButtonGroup, Button, Divider, makeStyles } from '@material-ui/core'

import { State, RepoProps, ReposIdsPage, layoutSelectors, reposSelectors } from 'state'

import RepoCard from './RepoCard'

const { getReposIdsPage } = reposSelectors
const { getReposPerPage } = layoutSelectors

const useStyles = makeStyles(theme => ({
  list: {
    paddingBottom: theme.spacing(5)
  },
  buttonGroup: {
    paddingLeft: '30%',
    paddingRight: '30%'
  }
}))

interface StateProps {
  reposPerPage: number
  idsPage: ReposIdsPage
}

interface OwnProps extends RepoProps {
  onPrevClick: () => void
  onNextClick: () => void
}

type RepoListProps = StateProps & OwnProps

const RepoList: React.FC<RepoListProps> = ({ reposPerPage, idsPage, page, onPrevClick, onNextClick }) => {
  const styles = useStyles()

  const length = idsPage.ids.length
  const hasPrevPage = page <= 0
  const hasNextPage = (page + 1) * reposPerPage < length

  return (
    <>
      {length > reposPerPage && (
        <Typography variant="body2">
          Showing {idsPage.from + 1} to {idsPage.to}
        </Typography>
      )}
      <ul className={styles.list}>
        {idsPage.ids.map(repoId => (
          <li key={repoId}>
            <RepoCard id={repoId} />
            <Divider />
          </li>
        ))}
      </ul>
      {length > reposPerPage && (
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
  reposPerPage: getReposPerPage(state),
  idsPage: getReposIdsPage(state, props)
}))(RepoList)
