import { LinearProgress, Typography, Button, makeStyles } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'

import { ProgressBox } from 'components/common'
import { State, ReposFetchProgress, reposActions, reposSelectors } from 'state'

const { stop: stopReposFetch } = reposActions
const { getReposFetchProgress } = reposSelectors

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    textAlign: 'center'
  },

  stopButton: {
    marginTop: theme.spacing(2)
  }
}))

interface StateProps {
  progress?: ReposFetchProgress
}

interface DispatchProps {
  stopReposFetch: typeof stopReposFetch
}

type ReposProgressProps = StateProps & DispatchProps

const ReposProgress: React.FC<ReposProgressProps> = ({ progress, stopReposFetch }) => {
  const styles = useStyles()

  function handleStopClick() {
    stopReposFetch()
  }

  if (progress) {
    return (
      <div className={styles.root}>
        <Typography variant="caption" gutterBottom>
          Loading repos: {progress.currentPage + '/' + progress.totalPages} pages
        </Typography>
        <LinearProgress variant="determinate" value={(progress.currentPage * 100) / progress.totalPages} />
        <Button size="small" variant="outlined" onClick={handleStopClick} className={styles.stopButton}>
          Stop
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
  { stopReposFetch: stopReposFetch }
)(ReposProgress)
