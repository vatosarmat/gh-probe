import React from 'react'
import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}))

interface ErrorBoxProps {
  error: string
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ error }) => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Typography variant="subtitle1" color="error" display="block">
        {error}
      </Typography>
    </div>
  )
}

export default ErrorBox
