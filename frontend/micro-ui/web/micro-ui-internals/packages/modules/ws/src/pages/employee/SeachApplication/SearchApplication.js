import React,{Fragment} from 'react'
import SearchApplication from '../../../components/SearchApplication/index.js'

const SearchApplicationView = ({data,onSubmit,count,resultOk}) => {
 
  return (
    <>
    <SearchApplication onSubmit={onSubmit} data={data} count={count} resultOk={resultOk}/>
    </>
  )
}

export default SearchApplicationView