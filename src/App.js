import './App.css'
import IndexRouter from './router/IndexRouter'
import { store, persistor } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter />
      </PersistGate>
    </Provider>
  )
}

export default App
