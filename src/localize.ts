/* eslint-disable no-template-curly-in-string */

import * as _ from 'lodash'

const messages = {
  lifeEventRulesFetchingError:
    'There was an issue fetching the life event settings for this employer. Please try again. If you’re still having trouble, contact Maxwell Customer Support at support@maxwellhealth.com.',
  lifeEventRules: 'Life Event Settings',
  lifeEventRulesDescription:
    'Here you can customize which benefits should be available for employees to review and update for each life event. Make sure that any benefits that are linked together (such as an HSA and a HDHP) have the same settings for each life event.',
  lifeEventRulesNote:
    'On default, employees will have 30 days from the date that they requested the life event to make changes to their profile information and benefits.',
  lifeEventRulesEditSettings: 'Edit Settings',
  lifeEventRulesCancel: 'Cancel',
  lifeEventRulesSave: 'Save',
  lifeEventRulesSaveChanges: 'Save Changes',
  lifeEventRulesAreYouSure: 'Are you sure?',
  lifeEventRulesConfirmSaveChanges:
    'Are you sure you want to update life event settings? Changes will be immediately applied to all in progress and future life events.',
  lifeEventRulesDependentAdd: 'Dependent Add Events',
  lifeEventRulesDependentAddTooltip:
    'Set the date that coverage for the added dependent should be effective',
  lifeEventRulesDependentDrop: 'Dependent Drop Events',
  lifeEventRulesDependentDropTooltip:
    'Set the date that the employee should be dropped from coverage. For example, if their last day of coverage is the end of the month following the date of the life event, choose "first of the month following life event date."',
  lifeEventRulesEmployeeAdd: 'Employee Add Events',
  lifeEventRulesEmployeeAddTooltip:
    'Set the date that coverage should be effective for the employee',
  lifeEventRulesEmployeeDrop: 'Employee Drop Events',
  lifeEventRulesEmployeeDropTooltip:
    'Set the date that the employee should be dropped from coverage. For example, if their last day of coverage is the end of the month following the date of the life event, choose "first of the month following life event date."',
  lifeEventRulesOther: 'Other Events',
  lifeEventRulesOtherTooltip:
    'Set the date that the coverage should be effective',
  lifeEventRulesLastEdited:
    'Last edited by: ${editedBy} on <time datetime="${datetime}">${editedOn}</time>',
  dateOfLifeEvent: 'Date of life event (default)',
  dateOfLifeEventPlus30days: 'Date of life event + 30 days',
  dateOfLifeEventPlus60days: 'Date of life event + 60 days',
  firstOfMonthFollowingLifeEventDate:
    'First of month following life event date',
  firstOfMonthFollowingLifeEventDatePlus30days:
    'First of month following life event date + 30 days',
  firstOfMonthFollowingLifeEventDatePlus60days:
    'First of month following life event date + 60 days',
}

export default function localize(
  key: keyof typeof messages,
  replacements?: object,
) {
  return _.template(messages[key])(replacements) || key
}
