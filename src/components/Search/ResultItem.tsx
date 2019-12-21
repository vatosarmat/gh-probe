import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import { Group, Person } from '@material-ui/icons'

import { State, usersSearchSelectors } from '../../state'
import { SearchResultItem, UserBrief } from '../../services/api'

const { getSearchResultById } = usersSearchSelectors

interface StateProps {
  item: SearchResultItem<UserBrief>
}

interface OwnProps {
  id: number
}

type ResultItemProps = StateProps & OwnProps

const ResultItem: React.FC<ResultItemProps> = ({ item }) => {
  const { login, avatar_url, type } = item

  return (
    <ListItem key={item.login} button component={Link} to={`/users/${login}`}>
      <ListItemAvatar>
        <Avatar alt="" src={avatar_url} />
      </ListItemAvatar>
      <ListItemText primary={login} />
      <ListItemSecondaryAction>{type === 'User' ? <Person /> : <Group />}</ListItemSecondaryAction>
    </ListItem>
  )
}

export default connect<StateProps, {}, OwnProps, State>((state, props) => ({
  item: getSearchResultById(state, props)
}))(ResultItem)
