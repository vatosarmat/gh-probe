import React from 'react'
import { connect } from 'react-redux'
import { Container, createMuiTheme, createStyles, makeStyles, Paper, Theme, Divider } from '@material-ui/core'
import * as colors from '@material-ui/core/colors'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import TopBar from './TopBar'
import SearchUsersForm from './Search/SearchUsersForm'
import SearchUsersResult from './Search/SearchUsersResult'
import UserRoute from './UserRoute'
import { State } from 'state'
import { PrimaryColor, primaryColorTuple } from 'services/layout'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: 0
    }
  })
)

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

type AppProps = StateProps

const App: React.FC<AppProps> = ({ primaryColor }) => {
  const classes = useStyles()

  return (
    <MuiThemeProvider theme={theme[primaryColor]}>
      <Container component={Paper} maxWidth="sm" className={classes.container}>
        <TopBar title="GitHub repos" />
        <BrowserRouter basename="/gh-probe">
          <Switch>
            <Route path="/users/:username" component={UserRoute} />
            <Route component={SearchRoute} />
          </Switch>
        </BrowserRouter>
      </Container>
    </MuiThemeProvider>
  )
}

export default connect<StateProps, {}, {}, State>(({ layout: { primaryColor } }) => ({
  primaryColor
}))(App)
