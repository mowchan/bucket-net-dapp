import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

WebFont.load({
  google: {
    families: ['Roboto Mono:300', 'Roboto']
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
