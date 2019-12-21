import React from 'react'
import { CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    textAlign: 'center'
  }
}))

const ProgressBox = () => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <CircularProgress />
    </div>
  )
}

export default ProgressBox
