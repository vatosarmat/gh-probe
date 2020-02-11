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
    marginLeft: theme.spacing(-2.5),
    marginRight: theme.spacing(-2.5)
  },

  cardContent: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),

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
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: theme.spacing(2),

    '& > *': {
      lineHeight: 2
    }
  },

  infoDate: {
    flexShrink: 0,
    flexGrow: 1,
    textAlign: 'right',
    marginLeft: theme.spacing(3)
  },

  infoIcon: {
    marginRight: theme.spacing(0.5)
  },

  infoCaption: {
    marginRight: theme.spacing(3),
    flexShrink: 0
  },

  dateInfo: {
    display: 'flex',
    textAlign: 'right',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '&:last-child': {
      flexGrow: 1
    },
    '& > *': {
      marginLeft: theme.spacing(3)
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

  const { name, description, language, stargazers_count, forks_count, created_at, pushed_at, html_url, archived } = repo

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
            <Typography variant="caption" className={styles.infoDate}>
              Created{' '}
              {dayjs(created_at).calendar(undefined, {
                sameElse: 'MMM D, YYYY'
              })}
            </Typography>
            <Typography variant="caption" className={styles.infoDate}>
              Pushed{' '}
              {dayjs(pushed_at).calendar(undefined, {
                sameElse: 'MMM D, YYYY'
              })}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default connect<StateProps, {}, OwnProps, State>((state, props) => ({
  repo: getRepoById(state, props)
}))(RepoCard)
