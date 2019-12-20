import React from 'react'
import { Divider } from '@material-ui/core'

import SearchUsersForm from './SearchUsersForm'
import SearchUsersResult from './SearchUsersResult'

const SearchRoute: React.FC = () => (
  <>
    <SearchUsersForm />
    <Divider />
    <SearchUsersResult />
  </>
)

export default SearchRoute
