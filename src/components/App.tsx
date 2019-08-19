import React from 'react'
import { connect } from 'react-redux'
import {
  Container,
  createMuiTheme,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Divider
} from '@material-ui/core'
import * as colors from '@material-ui/core/colors'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import TopBar from './TopBar'
import SearchUsersForm from './SearchUsersForm'
import SearchUsersResult from './SearchUsersResult'
import UserCard from './UserCard'
import ReposList from './ReposList'
import { State } from 'state'
import { PrimaryColor, primaryColorTuple } from 'concepts/layout'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: 0
    }
  })
)

type ThemeDict = Partial<Record<PrimaryColor, Theme>>

const theme: ThemeDict = primaryColorTuple.reduce(
  (themeMap, color: PrimaryColor) => ({
    ...themeMap,
    [color]: createMuiTheme({
      palette: {
        primary: colors[color]
      }
    })
  }),
  {}
)

const SearchRoute: React.FC = () => (
  <>
    <SearchUsersForm examples={['satansdeer', 'tj', 'mozilla', 'microsoft']} />
    <Divider />
    <SearchUsersResult />
  </>
)

const UserRoute: React.FC = () => (
  <>
    <UserCard />
    <ReposList />
  </>
)

interface AppProps {
  primaryColor: PrimaryColor
}

const App: React.FC<AppProps> = ({ primaryColor }) => {
  const classes = useStyles()

  return (
    <MuiThemeProvider theme={theme[primaryColor]}>
      <Container component={Paper} maxWidth="sm" className={classes.container}>
        <TopBar title="GitHub repos" />
        <BrowserRouter>
          <Switch>
            <Route path="/users/:login" component={UserRoute} />
            <Route component={SearchRoute} />
          </Switch>
        </BrowserRouter>
      </Container>
    </MuiThemeProvider>
  )
}

export default connect(({ layout: { primaryColor } }: State) => ({ primaryColor }))(App)
