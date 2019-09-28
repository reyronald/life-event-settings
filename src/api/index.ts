import { EmployerMatrixItem, BenefitType, MemberChangeType } from '../types'

import employerMatrix from './employerMatrix'
import benefitTypes from './benefitTypes'
import memberChangeTypes from './memberChangeTypes'

type ApiResponse<T> = T | { statusCode: number; text: string }

export async function getEmployerMatrix(): Promise<
  ApiResponse<{
    employerMatrix: EmployerMatrixItem[]
  }>
> {
  return { employerMatrix }
}

export async function getBenefitTypes(): Promise<BenefitType[]> {
  return benefitTypes
}

export async function getMemberChangeTypes(): Promise<MemberChangeType[]> {
  return memberChangeTypes
}
