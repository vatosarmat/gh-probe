import React from 'react'
import { connect } from 'react-redux'
import { Container, createTheme, makeStyles, Paper, Theme } from '@material-ui/core'
import * as colors from '@material-ui/core/colors'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { History } from 'history'

import TopBar from './TopBar'
import SearchRoute from './Search'
import UserRoute from './User'
import { State, layoutSelectors } from 'state'
import { PrimaryColor, primaryColorTuple, appConfig } from 'config'

const { getPrimaryColor } = layoutSelectors

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
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
    [color]: createTheme({
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

type UiProps = StateProps & OwnProps

const Ui: React.FC<UiProps> = ({ primaryColor, history }) => {
  const classes = useStyles()

  return (
    <MuiThemeProvider theme={theme[primaryColor]}>
      <Container component={Paper} maxWidth="sm" className={classes.container}>
        <TopBar />
        <Router history={history}>
          <Switch>
            <Route path={`${appConfig.routerBasename}/users/:login`} component={UserRoute} />
            <Route path={`${appConfig.routerBasename}/search`} component={SearchRoute} />
            <Redirect to={`${appConfig.routerBasename}/search`} />
          </Switch>
        </Router>
      </Container>
    </MuiThemeProvider>
  )
}

export default connect<StateProps, {}, OwnProps, State>(state => ({
  primaryColor: getPrimaryColor(state)
}))(Ui)
