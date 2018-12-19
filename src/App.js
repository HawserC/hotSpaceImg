import React from 'react';
import Rects, { RectsBox } from './rects';

export default class App extends React.Component{

  render() {
    return(
      <div style={{marginTop: 100, marginLeft: 200}}>
         <RectsBox 
            style={{width: '500px', height: '500px', border: '1px solid #000'}}
            onCallBack={res => console.log(res)}
          >
            <Rects/>
          </RectsBox>
      </div>
    )
  }
}