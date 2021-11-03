import React, { useState } from 'react'
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import { teal, indigo, purple } from '@material-ui/core/colors'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { CSSProperties } from '@material-ui/styles'
import { Menu as MenuIcon } from '@material-ui/icons'
import { connect } from 'react-redux'
import { reduce } from 'lodash-es'

import ArraySelect from './common/ArraySelect'
import { appConfig, ReposPerPage, PrimaryColor, reposPerPageTuple, primaryColorTuple } from 'config'

import { State, layoutSelectors, layoutActions, rootActions } from 'state'

const { getPrimaryColor, getReposPerPage } = layoutSelectors
const { setPrimaryColor, setReposPerPage } = layoutActions
const { reset: resetState } = rootActions

const useStyles = makeStyles(theme => ({
  perPageSelect: {
    [theme.breakpoints.up('xs')]: {
      marginBottom: theme.spacing(1)
    },
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(2)
    }
  },

  appBar: reduce(
    appConfig.padding.topBar,
    (css: CSSProperties, value, breakpoint) => ({
      ...css,
      [theme.breakpoints.up(breakpoint as Breakpoint)]: {
        padding: theme.spacing(value),
        '& > *': {
          padding: 0,
          marginRight: theme.spacing(value)
        }
      }
    }),
    {
      flexDirection: 'row'
    }
  ),

  menuButton: reduce(
    appConfig.padding.topBar,
    (css: CSSProperties, value, breakpoint) => ({
      ...css,
      [theme.breakpoints.up(breakpoint as Breakpoint)]: {
        padding: theme.spacing(value),
        margin: -theme.spacing(value),
        marginRight: 0
      }
    }),
    {}
  ),

  settingsDialogContent: {
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
      paddingBottom: 0
    }
  },

  toolbarTitle: {
    lineHeight: 1
  },

  tabsIndicator: {
    backgroundColor: theme.palette.primary.contrastText
  },

  tab: {
    fontSize: '.85rem'
  },

  indigo: {
    color: indigo[500],
    '&$checked': {
      color: indigo[500]
    }
  },

  purple: {
    color: purple[500],
    '&$checked': {
      color: purple[500]
    }
  },

  teal: {
    color: teal[500],
    '&$checked': {
      color: teal[500]
    }
  },

  checked: {},

  resetButton: {
    display: 'block',
    margin: theme.spacing(1),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5)
  }
}))

interface StateProps {
  reposPerPage: ReposPerPage
  primaryColor: PrimaryColor
}

interface DispatchProps {
  setReposPerPage: typeof setReposPerPage
  setPrimaryColor: typeof setPrimaryColor
  resetState: typeof resetState
}

type TopBarProps = StateProps & DispatchProps

const TopBar: React.FC<TopBarProps> = ({
  reposPerPage,
  primaryColor,
  setReposPerPage,
  setPrimaryColor,
  resetState
}) => {
  const styles = useStyles()
  const theme = useTheme()
  const isScreenSmall = useMediaQuery(theme.breakpoints.down('xs'))

  const [open, setOpen] = useState(false)

  const handleDialogOpen = () => {
    setOpen(true)
  }

  const handleDialogClose = () => {
    setOpen(false)
  }

  const handleReposPerPageChange = (value: ReposPerPage) => {
    setReposPerPage(value)
  }

  const handlePrimaryColorChange = (_evt: unknown, value: string) => {
    setPrimaryColor(value as PrimaryColor)
  }

  const handleResetClick = () => {
    resetState()
  }

  const { title } = appConfig

  return (
    <AppBar position="static" color="primary" className={styles.appBar}>
      <IconButton color="inherit" aria-label="Settings" onClick={handleDialogOpen} className={styles.menuButton}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" color="inherit" className={styles.toolbarTitle}>
        {title}
      </Typography>
      <Dialog open={open} onClose={handleDialogClose}>
        {isScreenSmall ? null : <DialogTitle>Settings</DialogTitle>}
        <DialogContent className={styles.settingsDialogContent}>
          <ArraySelect
            className={styles.perPageSelect}
            value={reposPerPage}
            prefix="Show"
            suffix="repos per page"
            array={[...reposPerPageTuple]}
            onChange={handleReposPerPageChange}
          />
          <Divider />
          <FormControl component="fieldset" margin={isScreenSmall ? 'dense' : 'normal'}>
            <Typography variant="body1" component="legend">
              Color scheme
            </Typography>
            <RadioGroup value={primaryColor} onChange={handlePrimaryColorChange}>
              {primaryColorTuple.map(color => (
                <FormControlLabel
                  key={color}
                  value={color}
                  control={
                    <Radio
                      classes={{ root: styles[color], checked: styles.checked }}
                      size={isScreenSmall ? 'small' : 'medium'}
                    />
                  }
                  label={color}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Divider />
          <Button
            color="secondary"
            className={styles.resetButton}
            onClick={handleResetClick}
            size={isScreenSmall ? 'small' : 'medium'}
          >
            Reset application state
          </Button>
          <Divider />
        </DialogContent>
        <DialogActions disableSpacing={isScreenSmall}>
          <Button onClick={handleDialogClose} color="primary" size={isScreenSmall ? 'small' : 'medium'}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  )
}

export default connect<StateProps, DispatchProps, {}, State>(
  state => ({
    primaryColor: getPrimaryColor(state),
    reposPerPage: getReposPerPage(state)
  }),
  {
    setPrimaryColor,
    setReposPerPage,
    resetState
  }
)(TopBar)
