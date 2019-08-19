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
  Typography
} from '@material-ui/core'
import { teal, indigo, purple } from '@material-ui/core/colors'
import { Menu as MenuIcon } from '@material-ui/icons'
import { connect } from 'react-redux'

import ArraySelect from './ArraySelect'
import { ReposPerPage, PrimaryColor, reposPerPageTuple, primaryColorTuple } from 'concepts/layout'
import { State, setPrimaryColor, setReposPerPage, getReposPerPage, getPrimaryColor } from 'state'

interface TopBarProps {
  readonly title: string
  readonly reposPerPage: ReposPerPage
  readonly primaryColor: PrimaryColor

  readonly setReposPerPage: typeof setReposPerPage
  readonly setPrimaryColor: typeof setPrimaryColor
}

const useStyles = makeStyles(theme => ({
  perPageSelect: {
    marginBottom: theme.spacing(2)
  },

  appBar: {
    flexDirection: 'row',
    paddingLeft: theme.spacing(2)
  },

  toolbarTitle: {
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
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

const TopBar: React.FC<TopBarProps> = ({
  title,
  reposPerPage,
  primaryColor,
  setReposPerPage,
  setPrimaryColor
}) => {
  const classes = useStyles()

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

  const handlePrimaryColorChange = (evt: unknown, value: string) => {
    setPrimaryColor(value as PrimaryColor)
  }

  return (
    <AppBar position="static" color="primary" className={classes.appBar}>
      <IconButton edge="start" color="inherit" aria-label="Menu" onClick={handleDialogOpen}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" color="inherit" className={classes.toolbarTitle}>
        {title}
      </Typography>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <ArraySelect
            className={classes.perPageSelect}
            value={reposPerPage}
            prefix="Show"
            suffix="repos per page"
            array={[...reposPerPageTuple]}
            onChange={handleReposPerPageChange}
          />
          <Divider />
          <FormControl component="fieldset" margin="normal">
            <Typography variant="body1" component="legend">
              Color scheme
            </Typography>
            <RadioGroup name="gender1" value={primaryColor} onChange={handlePrimaryColorChange}>
              {primaryColorTuple.map((color, key) => (
                <FormControlLabel
                  key={key}
                  value={color}
                  control={<Radio classes={{ root: classes[color], checked: classes.checked }} />}
                  label={color}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Divider />
          <Button color="secondary" className={classes.resetButton}>
            Reset application state
          </Button>
          <Divider />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  )
}

export default connect(
  (state: State) => ({
    primaryColor: getPrimaryColor(state),
    reposPerPage: getReposPerPage(state)
  }),
  {
    setPrimaryColor,
    setReposPerPage
  }
)(TopBar)
