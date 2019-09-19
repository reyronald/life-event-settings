import { ThunkAction } from 'redux-thunk'
import { AppState } from './configureStore'
import { BenefitType, MemberChangeType } from './types'

export type FetchBenefitTypesAction =
  | {
      type: 'FETCHING_BENEFIT_TYPES'
    }
  | {
      type: 'FETCHED_BENEFIT_TYPES'
      benefitTypes: BenefitType[]
    }
  | {
      type: 'ERROR_FETCHED_BENEFIT_TYPES'
      error: unknown
    }

export function fetchBenefitTypes(): ThunkAction<
  Promise<void>,
  AppState,
  void,
  FetchBenefitTypesAction
> {
  return async dispatch => {
    dispatch({ type: 'FETCHING_BENEFIT_TYPES' })
    const result = [{ id: '1', name: 'name', type: 'type' }]
    dispatch({ type: 'FETCHED_BENEFIT_TYPES', benefitTypes: result })
  }
}

export type FetchMemberChangeTypesAction =
  | {
      type: 'FETCHING_MEMBERCHANGE_TYPES'
    }
  | {
      type: 'FETCHED_MEMBERCHANGE_TYPES'
      memberChangeTypes: MemberChangeType[]
    }
  | {
      type: 'ERROR_FETCHING_MEMBERCHANGE_TYPES'
      error: unknown
    }

export function fetchMemberChangeTypes(): ThunkAction<
  Promise<void>,
  AppState,
  void,
  FetchMemberChangeTypesAction
> {
  return async dispatch => {
    dispatch({ type: 'FETCHING_MEMBERCHANGE_TYPES' })
    const result = [{ id: '1', name: 'name', type: 'type' }]
    dispatch({
      type: 'FETCHED_MEMBERCHANGE_TYPES',
      memberChangeTypes: result,
    })
  }
}
