import React from 'react'
import { connect } from 'react-redux'
import { Container, createMuiTheme, makeStyles, Paper, Theme } from '@material-ui/core'
import * as colors from '@material-ui/core/colors'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { History } from 'history'

import TopBar from './TopBar'
import SearchRoute from './Search'
import UserRoute from './User'
import { State, layoutSelectors } from 'state'
import { PrimaryColor, primaryColorTuple } from 'config'

const { getPrimaryColor } = layoutSelectors

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: 0
  },

  '@global': {
    'ul, li': {
      padding: 0,
      margin: 0,
      listStyleType: 'none'
    }
  }
}))

type ThemeDict = Record<PrimaryColor, Theme>

const theme: ThemeDict = primaryColorTuple.reduce(
  (themeMap, color: PrimaryColor) => ({
    ...themeMap,
    [color]: createMuiTheme({
      palette: {
        primary: colors[color]
      }
    })
  }),
  {} as ThemeDict
)

interface StateProps {
  primaryColor: PrimaryColor
}

interface OwnProps {
  history: History
}

type AppProps = StateProps & OwnProps

const App: React.FC<AppProps> = ({ primaryColor, history }) => {
  const classes = useStyles()

  return (
    <MuiThemeProvider theme={theme[primaryColor]}>
      <Container component={Paper} maxWidth="sm" className={classes.container}>
        <TopBar />
        <Router history={history}>
          <Switch>
            <Route path="/users/:username" component={UserRoute} />
            <Route path="/search" component={SearchRoute} />
            <Redirect to="/search" />
          </Switch>
        </Router>
      </Container>
    </MuiThemeProvider>
  )
}

export default connect<StateProps, {}, OwnProps, State>(state => ({
  primaryColor: getPrimaryColor(state)
}))(App)
