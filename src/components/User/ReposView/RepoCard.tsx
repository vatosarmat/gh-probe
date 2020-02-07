import React from 'react'
import { connect } from 'react-redux'
import { Card, CardActionArea, Typography, Chip, CardContent, makeStyles } from '@material-ui/core'
import { Circle, SourceFork, Star } from 'mdi-material-ui'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'

import { State, reposSelectors } from 'state'
import { Repo } from 'services/api'
import getLangColor from 'services/lang-color'

const { getRepoById } = reposSelectors

dayjs.extend(calendar)

const useStyles = makeStyles(theme => ({
  card: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2)
  },

  cardContent: {
    paddingTop: theme.spacing(4),

    '&:last-child': {
      paddingBottom: theme.spacing(4)
    }
  },

  name: {
    display: 'flex',
    alignItems: 'center'
  },

  archivedChip: {
    borderRadius: 4,
    marginLeft: theme.spacing(1)
  },

  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2)
  },

  infoIcon: {
    marginRight: theme.spacing(0.5)
  },

  infoCaption: {
    marginRight: theme.spacing(3),

    '&:last-child': {
      flexGrow: 1,
      textAlign: 'right'
    }
  }
}))

interface StateProps {
  repo?: Repo
}

interface OwnProps {
  id: number
}

type RepoCardProps = StateProps & OwnProps

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const styles = useStyles()

  if (!repo) {
    return null
  }

  const { name, description, language, stargazers_count, forks_count, pushed_at, html_url, archived } = repo

  return (
    <Card elevation={0} className={styles.card}>
      <CardActionArea disableRipple component="a" href={html_url} target="_blank">
        <CardContent className={styles.cardContent}>
          <div className={styles.name}>
            <Typography variant="h6">{name}</Typography>
            {archived && (
              <Chip
                label="archived"
                className={styles.archivedChip}
                color="secondary"
                variant="outlined"
                size="small"
              />
            )}
          </div>
          <Typography color="textSecondary">{description}</Typography>
          <div className={styles.info}>
            {language && (
              <>
                <Circle fontSize="inherit" className={styles.infoIcon} htmlColor={getLangColor(language)} />
                <Typography variant="caption" className={styles.infoCaption}>
                  {language}
                </Typography>
              </>
            )}
            {stargazers_count > 0 ? (
              <>
                <Star fontSize="inherit" className={styles.infoIcon} htmlColor="gray" />
                <Typography variant="caption" className={styles.infoCaption}>
                  {stargazers_count}
                </Typography>
              </>
            ) : null}
            {forks_count > 0 ? (
              <>
                <SourceFork fontSize="inherit" className={styles.infoIcon} htmlColor="gray" />
                <Typography variant="caption" className={styles.infoCaption}>
                  {forks_count}
                </Typography>
              </>
            ) : null}
            {
              <Typography variant="caption" className={styles.infoCaption}>
                Pushed at{' '}
                {dayjs(pushed_at).calendar(undefined, {
                  sameElse: 'MMM D, YYYY'
                })}
              </Typography>
            }
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default connect<StateProps, {}, OwnProps, State>((state, props) => ({
  repo: getRepoById(state, props)
}))(RepoCard)
