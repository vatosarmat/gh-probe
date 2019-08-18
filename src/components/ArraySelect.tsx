import {
  FormControl,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Select,
  StandardProps,
  Typography
} from '@material-ui/core'
import { FormControlProps } from '@material-ui/core/FormControl'
import clsx from 'clsx'
import React, { ChangeEvent } from 'react'

const useStyles = makeStyles(theme => ({
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },

  select: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },

  input: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))

type Item = string | number

interface ArraySelectProps<T extends Item>
  extends StandardProps<FormControlProps, 'root', 'onChange'> {
  prefix?: string
  suffix?: string

  array: T[]
  value: T
  onChange: (value: T) => void
  getLabel?: (value: T) => string
}

export default function ArraySelect<T extends Item>({
  value,
  array,
  onChange,
  getLabel = v => v.toString(),
  prefix,
  suffix,
  className
}: ArraySelectProps<T>) {
  const classes = useStyles({})

  function handleChange({
    target: { value }
  }: ChangeEvent<{ name?: string | undefined; value: unknown }>) {
    onChange(value as T)
  }

  return (
    <FormControl className={clsx(classes.formControl, className)}>
      <Typography variant="body1">{prefix} </Typography>
      <Select
        value={value}
        onChange={handleChange}
        input={<OutlinedInput labelWidth={0} classes={{ input: classes.input }} />}
        className={classes.select}
      >
        {array.map((item, idx) => (
          <MenuItem key={idx} value={item}>
            {getLabel(item)}
          </MenuItem>
        ))}
      </Select>
      <Typography variant="body1"> {suffix}</Typography>
    </FormControl>
  )
}
