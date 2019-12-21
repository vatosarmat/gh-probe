import { LinearProgress, Typography, Button, makeStyles } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'

import { ProgressBox } from 'components/common'
import { State, ReposFetchProgress, reposActions, reposSelectors } from 'state'

const { abort: abortReposFetch } = reposActions
const { getReposFetchProgress } = reposSelectors

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    textAlign: 'center'
  },

  abortButton: {
    marginTop: theme.spacing(2)
  }
}))

interface StateProps {
  progress?: ReposFetchProgress
}

interface DispatchProps {
  abortReposFetch: typeof abortReposFetch
}

type ReposProgressProps = StateProps & DispatchProps

const ReposProgress: React.FC<ReposProgressProps> = ({ progress, abortReposFetch }) => {
  const styles = useStyles()

  function handleAbortClick() {
    abortReposFetch()
  }

  if (progress) {
    return (
      <div className={styles.root}>
        <Typography variant="caption" gutterBottom>
          Loading repos: {progress.current + '/' + progress.total}
        </Typography>
        <LinearProgress variant="determinate" value={(progress.current * 100) / progress.total} />
        <Button size="small" variant="outlined" onClick={handleAbortClick} className={styles.abortButton}>
          Abort
        </Button>
      </div>
    )
  }

  return <ProgressBox />
}

export default connect<StateProps, DispatchProps, {}, State>(
  state => ({
    progress: getReposFetchProgress(state)
  }),
  { abortReposFetch }
)(ReposProgress)
