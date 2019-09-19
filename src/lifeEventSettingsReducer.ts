import { LifeEventRulesReadonlyState } from './types'
import { exhaustiveCheck } from './commonReducer'
import {
  FetchLifeEventRulesAction,
  FetchEmployerMatrixAction,
  UpdateEmployerMatrixAction,
  FetchLatestEmployerMatrixLogAction,
} from './lifeEventSettingsActions'

export const initialLifeEventSettingsState: LifeEventRulesReadonlyState = {
  lifeEventRulesRequest: {
    fetchState: 'uninitialized',
    employerId: undefined,
  },
  employerMatrixRequest: {
    fetchState: 'uninitialized',
    employerId: undefined,
    employerMatrix: undefined,
    error: undefined,
  },
  employerMatrixLogRequest: {
    fetchState: 'uninitialized',
    employerId: undefined,
    logEntry: undefined,
    error: undefined,
  },
}

type LifeEventRulesActions =
  | FetchLifeEventRulesAction
  | FetchEmployerMatrixAction
  | UpdateEmployerMatrixAction
  | FetchLatestEmployerMatrixLogAction

export default function lifeEventSettings(
  state = initialLifeEventSettingsState,
  action: LifeEventRulesActions,
): LifeEventRulesReadonlyState {
  switch (action.type) {
    case 'FETCHING_LIFE_EVENT_RULES': {
      return {
        ...state,
        lifeEventRulesRequest: {
          fetchState: 'fetching',
          employerId: action.employerId,
        },
      }
    }
    case 'FETCHED_LIFE_EVENT_RULES': {
      return {
        ...state,
        lifeEventRulesRequest: {
          fetchState: 'fetched',
          employerId: action.employerId,
        },
      }
    }
    case 'ERROR_LIFE_EVENT_RULES': {
      return {
        ...state,
        lifeEventRulesRequest: {
          fetchState: 'error',
          employerId: action.employerId,
          error: action.error,
        },
      }
    }
    case 'FETCHING_EMPLOYER_MATRIX': {
      return {
        ...state,
        employerMatrixRequest: {
          ...state.employerMatrixRequest,
          employerId: action.employerId,
          fetchState: 'fetching',
        },
      }
    }
    case 'FETCHED_EMPLOYER_MATRIX': {
      return {
        ...state,
        employerMatrixRequest: {
          employerId: action.employerId,
          employerMatrix: action.employerMatrix,
          fetchState: 'fetched',
          error: null,
        },
      }
    }
    case 'ERROR_EMPLOYER_MATRIX': {
      return {
        ...state,
        employerMatrixRequest: {
          ...state.employerMatrixRequest,
          employerId: action.employerId,
          error: action.error,
          fetchState: 'error',
        },
      }
    }
    case 'UPDATING_EMPLOYER_MATRIX': {
      return {
        ...state,
        employerMatrixRequest: {
          ...state.employerMatrixRequest,
          fetchState: 'fetching',
        },
      }
    }
    case 'UPDATED_EMPLOYER_MATRIX': {
      return {
        ...state,
        employerMatrixRequest: {
          ...state.employerMatrixRequest,
          employerMatrix: action.employerMatrix,
          fetchState: 'fetched',
          error: null,
        },
      }
    }
    case 'ERROR_UPDATING_EMPLOYER_MATRIX': {
      return {
        ...state,
        employerMatrixRequest: {
          ...state.employerMatrixRequest,
          error: action.error,
          fetchState: 'error',
        },
      }
    }
    case 'FETCHING_LATEST_EMPLOYER_MATRIX_LOG': {
      return {
        ...state,
        employerMatrixLogRequest: {
          ...state.employerMatrixLogRequest,
          fetchState: 'fetching',
          employerId: action.employerId,
        },
      }
    }
    case 'FETCHED_LATEST_EMPLOYER_MATIRX_LOG': {
      return {
        ...state,
        employerMatrixLogRequest: {
          ...state.employerMatrixLogRequest,
          fetchState: 'fetched',
          employerId: action.employerId,
          logEntry: action.logEntry,
        },
      }
    }
    case 'ERROR_LATEST_EMPLOYER_MATRIX_LOG': {
      return {
        ...state,
        employerMatrixLogRequest: {
          ...state.employerMatrixLogRequest,
          fetchState: 'error',
          employerId: action.employerId,
          error: action.error,
        },
      }
    }

    default:
      exhaustiveCheck(action)
      return state
  }
}
