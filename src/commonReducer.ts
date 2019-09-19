import {
  FetchBenefitTypesAction,
  FetchMemberChangeTypesAction,
} from './commonActions'
import { CommonState } from './types'

export const initialCommonState: CommonState = {
  benefitTypesRequest: {
    fetchState: 'uninitialized',
    benefitTypes: [],
    error: undefined,
  },
  memberChangeTypesRequest: {
    fetchState: 'uninitialized',
    memberChangeTypes: [],
    error: undefined,
  },
}

type CommonActions = FetchBenefitTypesAction | FetchMemberChangeTypesAction

export default function common(
  state = initialCommonState,
  action: CommonActions,
): CommonState {
  switch (action.type) {
    case 'FETCHING_BENEFIT_TYPES': {
      return {
        ...state,
        benefitTypesRequest: {
          ...state.benefitTypesRequest,
          fetchState: 'fetching',
        },
      }
    }
    case 'FETCHED_BENEFIT_TYPES': {
      return {
        ...state,
        benefitTypesRequest: {
          ...state.benefitTypesRequest,
          fetchState: 'fetched',
          benefitTypes: action.benefitTypes,
        },
      }
    }
    case 'ERROR_FETCHED_BENEFIT_TYPES': {
      return {
        ...state,
        benefitTypesRequest: {
          ...state.benefitTypesRequest,
          fetchState: 'error',
        },
      }
    }
    case 'FETCHING_MEMBERCHANGE_TYPES': {
      return {
        ...state,
        memberChangeTypesRequest: {
          ...state.memberChangeTypesRequest,
          fetchState: 'error',
        },
      }
    }
    case 'FETCHED_MEMBERCHANGE_TYPES': {
      return {
        ...state,
        memberChangeTypesRequest: {
          ...state.memberChangeTypesRequest,
          fetchState: 'fetched',
          memberChangeTypes: action.memberChangeTypes,
        },
      }
    }
    case 'ERROR_FETCHING_MEMBERCHANGE_TYPES': {
      return {
        ...state,
        memberChangeTypesRequest: {
          ...state.memberChangeTypesRequest,
          fetchState: 'error',
        },
      }
    }
    default: {
      exhaustiveCheck(action)
      return state
    }
  }
}

export function exhaustiveCheck(_: never) {}

export function exhaustiveCheckFail(value: never): never {
  throw new Error(
    `Exhaustive check failed. Case for value "${value}" was not handled.`,
  )
}
