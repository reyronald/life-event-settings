import React from 'react'
import classnames from 'classnames'

import {
  BenefitType,
  MemberChangeType,
  LifeEventRulesReadonlyState,
  EmployerMatrixItem,
} from './types'

import './LifeEventSettings.scss'
import Tabs from './Tabs/Tabs'

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
  React.useEffect(() => void fetchLifeEventRules(), [fetchLifeEventRules])

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
        <Tabs.Tab
          key={'functionalCategory'}
          title={localize('functionalCategory')}
        >
          WHATSUP
        </Tabs.Tab>
        <Tabs.Tab
          key={'functionalCategory2'}
          title={localize('functionalCategory2')}
        >
          WHATSUP22
        </Tabs.Tab>
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

function localize(key: string, rest?: any) {
  return key
}
