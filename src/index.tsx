import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Editor from './components/Editor/Editor';

const App = () => <Editor />;

ReactDOM.render(<App/>, document.getElementById('container'));