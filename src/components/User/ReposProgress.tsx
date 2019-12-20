import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Button,
  makeStyles
} from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'

import { State, fetchReposAbort, getReposProgress } from 'state'
import { ReposFetchProgress } from 'services/repos'

const useStyles = makeStyles(theme => ({
  abortButton: {
    marginTop: theme.spacing(2)
  }
}))

interface ReposProgressProps {
  readonly progress: ReposFetchProgress | null

  readonly fetchReposAbort: typeof fetchReposAbort
}

function ReposProgress({ progress, fetchReposAbort }: ReposProgressProps) {
  const styles = useStyles()

  function handleAbortClick() {
    fetchReposAbort()
  }

  if (progress) {
    return (
      <Box textAlign="center" py={4} px={4}>
        <Typography variant="caption" gutterBottom>
          Loading repos: {progress.current + '/' + progress.total}
        </Typography>
        <LinearProgress variant="determinate" value={(progress.current * 100) / progress.total} />
        <Button
          size="small"
          variant="outlined"
          onClick={handleAbortClick}
          className={styles.abortButton}
        >
          Abort
        </Button>
      </Box>
    )
  }

  return (
    <Box textAlign="center" py={4}>
      <CircularProgress />
    </Box>
  )
}

export default connect(
  (state: State) => ({
    progress: getReposProgress(state)
  }),
  { fetchReposAbort }
)(ReposProgress)
