import React from 'react'
import classnames from 'classnames'

import {
  BenefitType,
  MemberChangeType,
  LifeEventRulesReadonlyState,
  EmployerMatrixItem,
  DeepReadonlyObject,
  LifeEventRulesTableObject,
} from './types'
import EmployerMatrixTable from './EmployerMatrixTable'
import Tabs from './Tabs'

import './LifeEventSettings.scss'
import localize from './localize'

export interface Props {
  fetchLifeEventRules(): Promise<void>
  updateEmployerMatrix(
    employerMatrix: ReadonlyArray<EmployerMatrixItem>,
  ): Promise<void>
  lifeEventRulesRequest: LifeEventRulesReadonlyState['lifeEventRulesRequest']
  benefitTypes: BenefitType[]
  memberChangeTypes: MemberChangeType[]
  employerMatrixRequest: LifeEventRulesReadonlyState['employerMatrixRequest']
  employerMatrixLogRequest: LifeEventRulesReadonlyState['employerMatrixLogRequest']
}

export default function LifeEventSettings({
  fetchLifeEventRules,
  updateEmployerMatrix,
  lifeEventRulesRequest: { fetchState: fetchStateLifeEventRules },
  benefitTypes,
  memberChangeTypes,
  employerMatrixRequest: {
    fetchState: fetchStateEmployerMatrix,
    employerMatrix,
  },
  employerMatrixLogRequest: { fetchState: fetchStateLogEntry, logEntry },
}: Props) {
  const [variant, setVariant] = React.useState<'readonly' | 'edit'>('readonly')
  const [employerMatrixEditable, setEmployerMatrixEditable] = React.useState<
    ReadonlyArray<EmployerMatrixItem>
  >(employerMatrix || [])

  React.useEffect(() => void fetchLifeEventRules(), [fetchLifeEventRules])
  React.useEffect(() => setEmployerMatrixEditable(employerMatrix || []), [
    employerMatrix,
  ])

  const currentMatrix =
    variant === 'readonly' ? employerMatrix : employerMatrixEditable

  const lifeEventRulesTableObject = React.useMemo(
    () => getLifeEventRulesTableObject(currentMatrix, memberChangeTypes),
    [currentMatrix, memberChangeTypes],
  )

  if (
    fetchStateLifeEventRules === 'uninitialized' ||
    fetchStateLifeEventRules === 'fetching'
  ) {
    return <h1>Loading</h1>
  }

  if (
    fetchStateLifeEventRules === 'error' ||
    fetchStateEmployerMatrix === 'error' ||
    fetchStateLogEntry === 'error'
  ) {
    return (
      <h1 className="LifeEventRules--error">
        {localize('lifeEventRulesFetchingError')}
      </h1>
    )
  }

  function setEffectiveDateMode({ memberChangeTypeId, effectiveDateMode }) {
    setEmployerMatrixEditable(prevMatrix => {
      return prevMatrix.map(item => {
        if (item.memberChangeTypeId === memberChangeTypeId) {
          return { ...item, effectiveDateMode }
        }
        return item
      })
    })
  }

  function setBenefit({ isEnabled, memberChangeTypeId, benefitTypeName }) {
    setEmployerMatrixEditable(prevMatrix => {
      return prevMatrix.map(item => {
        if (
          item.memberChangeTypeId === memberChangeTypeId &&
          item.benefitTypeName === benefitTypeName
        ) {
          return { ...item, isEnabled }
        }
        return item
      })
    })
  }

  const functionalCategoriesOrder = [
    'dependent_add',
    'dependent_drop',
    'employee_add',
    'employee_drop',
    'other',
  ]
  const functionalCategories = Array.from(
    new Set(memberChangeTypes.map(t => t.functionalCategory)),
  )
    .filter(cat => cat !== 'not_in_matrix')
    .sort(
      (a, b) =>
        functionalCategoriesOrder.indexOf(a) -
        functionalCategoriesOrder.indexOf(b),
    )

  return (
    <div
      className={classnames('LifeEventRules', {
        'LifeEventRules--updating':
          fetchStateEmployerMatrix === 'uninitialized' ||
          fetchStateEmployerMatrix === 'fetching',
      })}
    >
      <p className="description">{localize('lifeEventRulesDescription')}</p>
      <p>{localize('lifeEventRulesNote')}</p>

      <Tabs
        variant="secondary"
        defaultActiveKey="functionalCategory"
        className="tabs"
      >
        {functionalCategories.map(functionalCategory => {
          return (
            <Tabs.Tab
              key={'functionalCategory'}
              title={localizeFunctionalCategory(functionalCategory)}
            >
              <EmployerMatrixTable
                variant={variant}
                effectiveTooltip={functionalCategory}
                visibleMemberChangeTypes={memberChangeTypes
                  .filter(
                    type => type.functionalCategory === functionalCategory,
                  )
                  .map(t => t.name)}
                memberChangeTypes={memberChangeTypes}
                benefitTypes={benefitTypes}
                lifeEventRulesTableObject={lifeEventRulesTableObject}
                setEffectiveDateMode={setEffectiveDateMode}
                setBenefit={setBenefit}
              />
            </Tabs.Tab>
          )
        })}
      </Tabs>

      {logEntry.createdAt != null && logEntry.editedBy != null && (
        <footer>
          <p
            dangerouslySetInnerHTML={{
              __html: localize('lifeEventRulesLastEdited', {
                datetime: logEntry.createdAt,
                editedOn: logEntry.createdAt ? logEntry.createdAt : '?',
                editedBy: logEntry.editedBy || '?',
              }),
            }}
          />
        </footer>
      )}
    </div>
  )
}

export function getLifeEventRulesTableObject(
  employerMatrix: undefined | void | ReadonlyArray<EmployerMatrixItem>,
  memberChangeTypes: MemberChangeType[],
): LifeEventRulesTableObject {
  if (!employerMatrix /*|| memberChangeTypes!.length === 0*/) {
    return {}
  }

  const lifeEventRulesTableObject = employerMatrix.reduce<
    LifeEventRulesTableObject
  >((prev, curr) => {
    const memberChangeType = memberChangeTypes.find(
      type => type.id === curr.memberChangeTypeId,
    )
    const memberChangeTypeName = memberChangeType.name
    const memberChangeTypeDescription = curr.memberChangeTypeDescription

    if (memberChangeTypeDescription in prev) {
      prev[memberChangeTypeDescription].benefitTypes[curr.benefitTypeName] =
        curr.isEnabled
    } else {
      prev[memberChangeTypeDescription] = {
        memberChangeTypeName,
        memberChangeTypeDescription,
        effectiveDateMode: curr.effectiveDateMode,
        benefitTypes: { [curr.benefitTypeName]: curr.isEnabled },
      }
    }
    return prev
  }, {})

  return lifeEventRulesTableObject
}

function localizeFunctionalCategory(
  functionalCategory: MemberChangeTypeFunctionalCategory,
) {
  const keys: Record<MemberChangeTypeFunctionalCategory, string> = {
    employee_add: localize('lifeEventRulesEmployeeAdd'),
    employee_drop: localize('lifeEventRulesEmployeeDrop'),
    dependent_add: localize('lifeEventRulesDependentAdd'),
    dependent_drop: localize('lifeEventRulesDependentDrop'),
    other: localize('lifeEventRulesOther'),
    not_in_matrix: 'not_in_matrix',
  }
  return functionalCategory in keys
    ? keys[functionalCategory]
    : functionalCategory
}
