import {Route, Switch} from 'wouter'
import './App.css'
import {FormBuilderExample} from './components/FormBuilderExample'
import {FormViewerExample} from './components/FormViewerExample'
import {Main} from './components/Main'

function App() {
  return (
    <Switch>
      <Route path="/" component={Main}/>
      <Route path="/form-builder" component={FormBuilderExample}/>
      <Route path="/form-viewer" component={FormViewerExample}/>
    </Switch>)
}

export default App
