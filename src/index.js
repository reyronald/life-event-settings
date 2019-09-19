import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './configureStore'

import './styles.scss'
import LifeEventsSettingsContainer from './LifeEventsSettingsContainer'

function App() {
  return (
    <div className="App">
      <LifeEventsSettingsContainer />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement,
)
