import { connect } from 'react-redux'
import { AppState } from './configureStore'
import {
  fetchLifeEventRules,
  updateEmployerMatrix,
} from './lifeEventSettingsActions'
import LifeEventSettings, { Props } from './LifeEventSettings'
import { BenefitType, MemberChangeType } from './types'

const mapStateToProps = (state: AppState): Partial<Props> => {
  return {
    benefitTypes: state.common.benefitTypesRequest
      .benefitTypes as BenefitType[],
    memberChangeTypes: state.common.memberChangeTypesRequest
      .memberChangeTypes as MemberChangeType[],
    lifeEventRulesRequest: state.lifeEventSettings.lifeEventRulesRequest,
    employerMatrixRequest: state.lifeEventSettings.employerMatrixRequest,
    employerMatrixLogRequest: state.lifeEventSettings.employerMatrixLogRequest,
  }
}

export default connect(
  mapStateToProps,
  {
    fetchLifeEventRules,
    updateEmployerMatrix,
  },
)(LifeEventSettings)
