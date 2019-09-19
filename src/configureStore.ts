import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose,
  Store,
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import common from './commonReducer'
import lifeEventSettings from './lifeEventSettingsReducer'
import { CommonState, LifeEventRulesReadonlyState } from './types'

export type AppState = {
  common: CommonState
  lifeEventSettings: LifeEventRulesReadonlyState
}

const reducers = combineReducers<AppState>({
  common,
  lifeEventSettings,
})

function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware),
      f => f,
    ),
  )
  return store
}

export const store: Store<AppState> = configureStore()
