import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, makeStyles } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { CSSProperties } from '@material-ui/styles'
import { Group, Person } from '@material-ui/icons'
import { reduce } from 'lodash'

import { State, usersSearchSelectors } from 'state'
import { SearchUserResultItem } from 'services/api'
import { appConfig } from 'config'

const { getSearchResultById } = usersSearchSelectors

const useStyles = makeStyles(theme => ({
  listItem: reduce(
    appConfig.padding.searchResultItem,
    (css: CSSProperties, { horizontal, vertical }, breakpoint) => ({
      ...css,
      [theme.breakpoints.up(breakpoint as Breakpoint)]: {
        paddingLeft: theme.spacing(horizontal),
        paddingTop: theme.spacing(vertical),
        paddingBottom: theme.spacing(vertical)
      }
    }),
    {}
  ),

  secondaryAction: reduce(
    appConfig.padding.searchResultItem,
    (css: CSSProperties, { horizontal }, breakpoint) => ({
      ...css,
      [theme.breakpoints.up(breakpoint as Breakpoint)]: {
        right: theme.spacing(horizontal)
      }
    }),
    {}
  )
}))

interface StateProps {
  item?: SearchUserResultItem
}

interface OwnProps {
  id: number
}

type ResultItemProps = StateProps & OwnProps

const ResultItem: React.FC<ResultItemProps> = ({ item }) => {
  const styles = useStyles()

  if (!item) {
    return null
  }
  const { login, avatarUrl, type } = item

  return (
    <ListItem key={item.id} button component={Link} to={`/users/${login}`} className={styles.listItem}>
      <ListItemAvatar>
        <Avatar alt="" src={avatarUrl} />
      </ListItemAvatar>
      <ListItemText primary={login} />
      <ListItemSecondaryAction className={styles.secondaryAction}>
        {type === 'User' ? <Person /> : <Group />}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default connect<StateProps, {}, OwnProps, State>((state, props) => ({
  item: getSearchResultById(state, props)
}))(ResultItem)
