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
    marginRight: theme.spacing(1)
  },

  caption: {
    marginRight: theme.spacing(3)
  }
}))

interface IconWithCaptionProps {
  icon: React.ComponentType<any>
  caption: string
  link?: true
}

const IconWithCaption: React.FC<IconWithCaptionProps> = ({ icon: Icon, caption, link }) => {
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

export default IconWithCaption
