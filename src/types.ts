export type FetchState = 'uninitialized' | 'fetching' | 'fetched' | 'error'

export type BenefitType = {
  id: string
  type: string
  name: string
}
export type MemberChangeTypeFunctionalCategory =
  | 'employee_add'
  | 'employee_drop'
  | 'dependent_add'
  | 'dependent_drop'
  | 'other'
  | 'not_in_matrix'

export type MemberChangeType = {
  id: string
  type: string
  name: string
  functionalCategory: MemberChangeTypeFunctionalCategory
}

export type CommonState = {
  benefitTypesRequest: {
    fetchState: FetchState
    benefitTypes: undefined | void | BenefitType[]
    error?: unknown
  }
  memberChangeTypesRequest: {
    fetchState: FetchState
    memberChangeTypes: undefined | void | MemberChangeType[]
    error?: unknown
  }
}

export type DeepReadonlyObject<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>
}

export type DeepReadonly<T> = T extends (infer E)[]
  ? ReadonlyArray<DeepReadonlyObject<E>>
  : T extends object
  ? DeepReadonlyObject<T>
  : T

export type EffectiveDateMode =
  | 'event_effective_date'
  | 'event_effective_date_plus_30days'
  | 'event_effective_date_plus_60days'
  | 'first_of_following_month'
  | 'first_of_following_month_plus_30days'
  | 'first_of_following_month_plus_60days'

export type EffectiveDateModeRaw =
  | 'event_effective_date'
  | 'first_of_following_month'

export type EmployerMatrixItem = {
  id?: string
  employerMatrixItemId?: string
  employerId?: string
  memberChangeTypeId: string
  benefitTypeName: string
  effectiveDateMode: EffectiveDateMode
  createdAt?: string
  isEnabled: boolean
  memberChangeTypeDescription?: string
}

export type EmployerMatrixItemRaw = EmployerMatrixItem & {
  effectiveDateMode: EffectiveDateModeRaw
  effectiveDateOffset: number
}

export type LifeEventRulesState = {
  lifeEventRulesRequest: {
    fetchState: FetchState
    employerId: undefined | string
    error?: unknown
  }
  employerMatrixRequest: {
    fetchState: FetchState
    employerId: undefined | void | string
    employerMatrix: undefined | void | EmployerMatrixItem[]
    error?: unknown
  }
  employerMatrixLogRequest: {
    fetchState: FetchState
    employerId: undefined | string
    logEntry: undefined | EmployerMatrixLogEntry
    error?: unknown
  }
}

export type LifeEventRulesReadonlyState = DeepReadonly<LifeEventRulesState>

export type BenefitTypeIsEnabledForMatrix = {
  [benefitTypeName: string]: boolean
}

export type LifeEventRulesTableRow = {
  memberChangeTypeName: string
  memberChangeTypeDescription: string
  effectiveDateMode: EffectiveDateMode
  benefitTypes: BenefitTypeIsEnabledForMatrix
}

export type LifeEventRulesTableObject = {
  [memberChangeTypeDescription: string]: LifeEventRulesTableRow
}

export type EmployerMatrixLogEntry = {
  createdAt: string | null
  editedBy: string | null
}
