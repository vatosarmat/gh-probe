import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'sans-serif',
    margin: theme.spacing(6)
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold'
  }
}))

const ErrorComponent: React.FC<{ error: Error }> = ({ error }) => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <p>App failed to start:</p>
      <p className={styles.errorText}>{error.toString()}</p>
    </div>
  )
}

export default ErrorComponent
