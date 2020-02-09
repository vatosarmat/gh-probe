import React, { ChangeEvent, useState } from 'react'
import { FormControl, makeStyles, MenuItem, OutlinedInput, Select, StandardProps, Typography } from '@material-ui/core'
import { FormControlProps } from '@material-ui/core/FormControl'
import clsx from 'clsx'

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

interface ArraySelectProps<T extends Object> extends StandardProps<FormControlProps, 'root', 'onChange'> {
  prefix?: string
  suffix?: string

  array: readonly T[]
  value: T
  onChange: (value: T) => void
  getLabel?: (value: T) => string
  getKey?: (value: T) => string
}

export default function ArraySelect<T extends Object>({
  value,
  array,
  onChange,
  getLabel = v => v.toString(),
  getKey = v => v.toString(),
  prefix,
  suffix,
  className
}: ArraySelectProps<T>) {
  const classes = useStyles({})
  const [selectedIndex, setSelectedIndex] = useState(0)

  function handleChange({ target: { value } }: ChangeEvent<{ name?: string | undefined; value: unknown }>) {
    const idx = value as number
    setSelectedIndex(idx)
    onChange(array[idx])
  }

  const selectValue = array[selectedIndex] === value ? selectedIndex : array.indexOf(value)

  return (
    <FormControl className={clsx(classes.formControl, className)}>
      <Typography variant="body1">{prefix} </Typography>
      <Select
        value={selectValue}
        onChange={handleChange}
        input={<OutlinedInput labelWidth={0} classes={{ input: classes.input }} />}
        className={classes.select}
      >
        {array.map((item, idx) => (
          <MenuItem key={getKey(item)} value={idx}>
            {getLabel(item)}
          </MenuItem>
        ))}
      </Select>
      <Typography variant="body1"> {suffix}</Typography>
    </FormControl>
  )
}
