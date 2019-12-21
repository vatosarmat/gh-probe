import React from 'react'
import { Divider } from '@material-ui/core'

import SearchUsersForm from './SearchUsersForm'
import ResultList from './ResultList'

const SearchRoute: React.FC = () => (
  <>
    <SearchUsersForm />
    <Divider />
    <ResultList />
  </>
)

export default SearchRoute
