import {Route, Switch} from 'wouter'
import './App.css'
import {FormBuilderExample} from './components/FormBuilderExample'
import {FormViewerExample} from './components/FormViewerExample'
import {Main} from './components/Main'

/**
 * @returns the main application component.
 */
export default function App() {
  return (
    <Switch>
      <Route path="/" component={Main}/>
      <Route path="/form-builder" component={FormBuilderExample}/>
      <Route path="/form-viewer" component={FormViewerExample}/>
    </Switch>)
}
