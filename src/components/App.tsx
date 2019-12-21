import React from 'react'
import { connect } from 'react-redux'
import { Container, createMuiTheme, createStyles, makeStyles, Paper, Theme } from '@material-ui/core'
import * as colors from '@material-ui/core/colors'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import TopBar from './TopBar'
import SearchRoute from './Search'
// import UserRoute from './User'
import { State, layoutSelectors } from 'state'
import { appConfig, PrimaryColor, primaryColorTuple } from 'config'

const { getPrimaryColor } = layoutSelectors

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
  const { basename } = appConfig

  return (
    <MuiThemeProvider theme={theme[primaryColor]}>
      <Container component={Paper} maxWidth="sm" className={classes.container}>
        <TopBar />
        <BrowserRouter basename={basename}>
          <Switch>
            {/* <Route path="/users/:username" component={UserRoute} /> */}
            <Route component={SearchRoute} />
          </Switch>
        </BrowserRouter>
      </Container>
    </MuiThemeProvider>
  )
}

export default connect<StateProps, {}, {}, State>(state => ({
  primaryColor: getPrimaryColor(state)
}))(App)
