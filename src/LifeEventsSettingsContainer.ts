import { connect } from 'react-redux'
import { AppState } from './configureStore'
import {
  fetchLifeEventRules,
  updateEmployerMatrix,
} from './lifeEventSettingsActions'
import LifeEventSettings, { Props } from './LifeEventSettings'

const mapStateToProps = (state: AppState): Partial<Props> => {
  return {
    benefitTypesRequest: state.common.benefitTypesRequest,
    memberChangeTypesRequest: state.common.memberChangeTypesRequest,
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
