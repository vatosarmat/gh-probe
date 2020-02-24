import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, makeStyles } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  backButton: {
    // marginLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(1.5)
  },

  backIcon: {
    marginRight: theme.spacing(1)
  }
}))

const BackButton: React.FC = () => {
  const styles = useStyles()

  return (
    <Button className={styles.backButton} variant="text" size="small" component={RouterLink} to="/">
      <ArrowBack className={styles.backIcon} />
      Back to search
    </Button>
  )
}

export default BackButton
