import React from 'react'
import { Link, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  icon: {
    marginRight: theme.spacing(0.5)
  },

  caption: {
    wordBreak: 'break-all'
  }
}))

interface IconWithTextProps {
  icon: React.ComponentType<any>
  caption: string
  link?: true
}

const IconWithText: React.FC<IconWithTextProps> = ({ icon: Icon, caption, link }) => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Icon className={styles.icon} htmlColor="gray" />
      {link ? (
        <Link className={styles.caption} href={caption} target="_blank">
          {caption}
        </Link>
      ) : (
        <Typography className={styles.caption} variant="body2">
          {caption}
        </Typography>
      )}
    </div>
  )
}

export default IconWithText
