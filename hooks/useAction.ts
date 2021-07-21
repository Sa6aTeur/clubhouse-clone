import { unwrapResult, AsyncThunk } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';


// useAction aka useAsyncThunk
export const useAsyncAction = <Arg, Returned>(
  actionCreator: AsyncThunk<Returned, Arg, {}>
) => {
  const dispatch = useDispatch<any>();

  return useCallback((arg: Arg) => {
    return dispatch(actionCreator(arg))
    .then(result => {
      return unwrapResult(result) 
    })
    .catch(err => {
      return Promise.reject(err)
    })
  }, [dispatch, actionCreator])
};

