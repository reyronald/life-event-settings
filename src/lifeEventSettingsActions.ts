import { ThunkAction } from 'redux-thunk'
import {
  EmployerMatrixItem,
  EmployerMatrixItemRaw,
  EffectiveDateMode,
  EffectiveDateModeRaw,
  EmployerMatrixLogEntry,
  FetchState,
} from './types'
import * as api from './api'
import { fetchBenefitTypes, fetchMemberChangeTypes } from './commonActions'
import { AppState } from './configureStore'

export type FetchLifeEventRulesAction = {
  type:
    | 'FETCHING_LIFE_EVENT_RULES'
    | 'FETCHED_LIFE_EVENT_RULES'
    | 'ERROR_LIFE_EVENT_RULES'
  employerId: string
  error?: unknown
}

const employerId = ':employerId'

export function fetchLifeEventRules(): ThunkAction<
  Promise<void>,
  AppState,
  void,
  FetchLifeEventRulesAction
> {
  return async dispatch => {
    dispatch({ type: 'FETCHING_LIFE_EVENT_RULES', employerId })

    try {
      await Promise.all([
        dispatch(fetchBenefitTypes()),
        dispatch(fetchMemberChangeTypes()),
        dispatch(fetchEmployerMatrix()),
        dispatch(fetchLatestEmployerMatrixLog()),
      ])

      dispatch({ type: 'FETCHED_LIFE_EVENT_RULES', employerId })
    } catch (error) {
      dispatch({ type: 'ERROR_LIFE_EVENT_RULES', employerId, error })
      throw error
    }
  }
}

export type FetchEmployerMatrixAction =
  | {
      type: 'FETCHING_EMPLOYER_MATRIX'
      employerId: string
    }
  | {
      type: 'FETCHED_EMPLOYER_MATRIX'
      employerId: string
      employerMatrix: EmployerMatrixItem[]
    }
  | {
      type: 'ERROR_EMPLOYER_MATRIX'
      employerId: string
      error: unknown
    }

export function fetchEmployerMatrix(): ThunkAction<
  Promise<void>,
  AppState,
  void,
  FetchEmployerMatrixAction
> {
  return async (dispatch, getState) => {
    try {
      const {
        lifeEventSettings: { employerMatrixRequest },
      } = getState()
      const shouldFetch = getShouldFetch(employerMatrixRequest.fetchState)
      if (!shouldFetch) {
        return
      }

      dispatch({ type: 'FETCHING_EMPLOYER_MATRIX', employerId })

      const result = await api.getEmployerMatrix()

      if ('employerMatrix' in result) {
        const employerMatrix = fromEmployerMatrixItemsRaw(result.employerMatrix)
        validateEffectiveDatemodes(employerMatrix)
        dispatch({
          type: 'FETCHED_EMPLOYER_MATRIX',
          employerId,
          employerMatrix,
        })
      } else {
        const error = result
        dispatch({ type: 'ERROR_EMPLOYER_MATRIX', employerId, error })
        throw error
      }
    } catch (error) {
      dispatch({ type: 'ERROR_EMPLOYER_MATRIX', employerId, error })
      throw error
    }
  }
}

function fromEmployerMatrixItemsRaw(
  employerMatrixRaw: EmployerMatrixItemRaw[],
): EmployerMatrixItem[] {
  const modes: Record<
    EffectiveDateModeRaw,
    { [offset: number]: EffectiveDateMode }
  > = {
    event_effective_date: {
      0: 'event_effective_date',
      30: 'event_effective_date_plus_30days',
      60: 'event_effective_date_plus_60days',
    },
    first_of_following_month: {
      0: 'first_of_following_month',
      30: 'first_of_following_month_plus_30days',
      60: 'first_of_following_month_plus_60days',
    },
  }

  return employerMatrixRaw.map<EmployerMatrixItem>(item => {
    const { effectiveDateMode, effectiveDateOffset, ...rest } = item
    if (
      effectiveDateMode in modes &&
      effectiveDateOffset in modes[effectiveDateMode]
    ) {
      return {
        ...rest,
        effectiveDateMode: modes[effectiveDateMode][effectiveDateOffset],
      }
    }

    throw new Error(
      `Unexpected value for "effectiveDateMode" or "effectiveDateOffset": "${effectiveDateMode}" and "${effectiveDateOffset}"`,
    )
  })
}

function validateEffectiveDatemodes(employerMatrix: EmployerMatrixItem[]) {
  const memberChangeTypeAndEffectiveDateMode = new Map()
  for (const item of employerMatrix) {
    if (!memberChangeTypeAndEffectiveDateMode.has(item.memberChangeTypeId)) {
      memberChangeTypeAndEffectiveDateMode.set(
        item.memberChangeTypeId,
        item.effectiveDateMode,
      )
    } else if (
      memberChangeTypeAndEffectiveDateMode.get(item.memberChangeTypeId) !==
      item.effectiveDateMode
    ) {
      console.warn(
        `Found matrix items for the same memberchange type (${
          item.memberChangeTypeDescription
        }) with different effective date modes. All items for a given memberchange type must have the same effective date mode.`,
      )
    }
  }
}

export type UpdateEmployerMatrixAction =
  | { type: 'UPDATING_EMPLOYER_MATRIX' }
  | { type: 'UPDATED_EMPLOYER_MATRIX'; employerMatrix: EmployerMatrixItem[] }
  | { type: 'ERROR_UPDATING_EMPLOYER_MATRIX'; error: unknown }

export function updateEmployerMatrix(
  employerMatrixToUpdate: EmployerMatrixItem[],
): ThunkAction<Promise<void>, AppState, void, UpdateEmployerMatrixAction> {
  return async dispatch => {
    dispatch({ type: 'UPDATING_EMPLOYER_MATRIX' })

    try {
      const matrixItems = fromEmployerMatrixItems(employerMatrixToUpdate)
      console.log('Saving ', matrixItems)
      const result = true

      if (result) {
        await dispatch(fetchLatestEmployerMatrixLog())

        const employerMatrix = employerMatrixToUpdate
        dispatch({
          type: 'UPDATED_EMPLOYER_MATRIX',
          employerMatrix,
        })
      } else {
        const error = result
        dispatch({ type: 'ERROR_UPDATING_EMPLOYER_MATRIX', error })
        throw error
      }
    } catch (error) {
      dispatch({ type: 'ERROR_UPDATING_EMPLOYER_MATRIX', error })
      throw error
    }
  }
}

function fromEmployerMatrixItems(
  employerMatrixRaw: EmployerMatrixItem[],
): EmployerMatrixItemRaw[] {
  const modes: Record<EffectiveDateMode, EffectiveDateModeRaw> = {
    event_effective_date: 'event_effective_date',
    event_effective_date_plus_30days: 'event_effective_date',
    event_effective_date_plus_60days: 'event_effective_date',
    first_of_following_month: 'first_of_following_month',
    first_of_following_month_plus_30days: 'first_of_following_month',
    first_of_following_month_plus_60days: 'first_of_following_month',
  }
  const offsets: Record<EffectiveDateMode, 0 | 30 | 60> = {
    event_effective_date: 0,
    event_effective_date_plus_30days: 30,
    event_effective_date_plus_60days: 60,
    first_of_following_month: 0,
    first_of_following_month_plus_30days: 30,
    first_of_following_month_plus_60days: 60,
  }

  return employerMatrixRaw.map<EmployerMatrixItemRaw>(item => {
    const { id, ...itemWithoutId } = item
    if (item.effectiveDateMode in modes && item.effectiveDateMode in offsets) {
      return {
        ...itemWithoutId,
        employerMatrixItemId: item.id,
        effectiveDateMode: modes[item.effectiveDateMode],
        effectiveDateOffset: offsets[item.effectiveDateMode],
      }
    }

    throw new Error(
      `Effective date mode "${item.effectiveDateMode}" not recognized.`,
    )
  })
}

export type FetchLatestEmployerMatrixLogAction =
  | {
      type: 'FETCHING_LATEST_EMPLOYER_MATRIX_LOG'
      employerId: string
    }
  | {
      type: 'FETCHED_LATEST_EMPLOYER_MATIRX_LOG'
      employerId: string
      logEntry: EmployerMatrixLogEntry
    }
  | {
      type: 'ERROR_LATEST_EMPLOYER_MATRIX_LOG'
      employerId: string
      error: unknown
    }

export function fetchLatestEmployerMatrixLog(): ThunkAction<
  Promise<void>,
  AppState,
  void,
  FetchLatestEmployerMatrixLogAction
> {
  return async (dispatch, getState) => {
    try {
      const {
        lifeEventSettings: { employerMatrixLogRequest },
      } = getState()
      const shouldFetch = getShouldFetch(employerMatrixLogRequest.fetchState)
      if (!shouldFetch) {
        return
      }

      dispatch({ type: 'FETCHING_LATEST_EMPLOYER_MATRIX_LOG', employerId })

      const createdAt = ''
      const editedBy = ''

      dispatch({
        type: 'FETCHED_LATEST_EMPLOYER_MATIRX_LOG',
        employerId,
        logEntry: {
          createdAt,
          editedBy,
        },
      })
    } catch (error) {
      dispatch({ type: 'ERROR_LATEST_EMPLOYER_MATRIX_LOG', employerId, error })
      throw error
    }
  }
}

function getShouldFetch(fetchState: FetchState) {
  const shouldFetch = fetchState === 'uninitialized' || fetchState === 'error'
  return shouldFetch
}
