import React from 'react';
import Rects, { RectsBox } from './rects';

export default class Text extends React.Component{

  render() {
    return(
      <div style={{marginTop: 100, marginLeft: 200}}>
         <RectsBox 
            style={{width: '500px', height: '500px', border: '1px solid #000'}}
          >
            <Rects/>
          </RectsBox>
      </div>
     
    )
  }

}