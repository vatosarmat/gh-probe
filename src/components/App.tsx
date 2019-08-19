import React from 'react'
import { connect } from 'react-redux'
import {
  Container,
  createMuiTheme,
  createStyles,
  Divider,
  makeStyles,
  Paper,
  Theme
} from '@material-ui/core'
import * as colors from '@material-ui/core/colors'
import { MuiThemeProvider } from '@material-ui/core/styles'

import TopBar from './TopBar'
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

console.log(theme)

interface AppProps {
  primaryColor: PrimaryColor
}

const App: React.FC<AppProps> = ({ primaryColor }) => {
  const classes = useStyles()

  return (
    <MuiThemeProvider theme={theme[primaryColor]}>
      <Container component={Paper} maxWidth="sm" className={classes.container}>
        <TopBar title="GitHub repos" />
      </Container>
    </MuiThemeProvider>
  )
}

export default connect(({ layout: { primaryColor } }: State) => ({ primaryColor }))(App)
