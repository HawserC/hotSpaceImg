import React, { Fragment } from "react";
import { PropTypes } from "prop-types";
import Context from './context';
import './App.css';

class RectKid extends React.Component{
  refRectKid = React.createRef();
  
  handleMouseDown = (event, index) => {
    let disX, disY;
    disX = event.clientX - event.target.offsetLeft;
    disY = event.clientY - event.target.offsetTop;
    this.handleSetResData(index, {disX, disY})
  }
  handleResizeMouseDown = (event, index) => {
    event.stopPropagation();
    this.handleSetResData(index)
  }
  handleSetResData = (index, isHas=false) => {
    const { context } = this.props;
    const { disX, disY } = isHas;
    let rects, params;
    rects = context.rects;
    params = isHas ? { motionType: 'move', ix: index, disX, disY } : { motionType: 'resize', ix: index}
    context.setResponseData({rects, params})
  }
  render() {
    const { context } = this.props;
    const { rects } = context;
    return(
      <Fragment>
      {
        !!rects.length && rects.map((item, index) => {
          return(
            <div 
              key={index}
              className="rect"
              style={{
                width: item.width,
                height: item.height,
                position: 'absolute',
                top: item.y,
                left: item.x,
                zIndex: index
              }}
              ref={this.refRectKid} 
              onMouseDown={event => this.handleMouseDown(event, index)}
            >
              <div className="rect-index" onMouseDown={event => this.handleResizeMouseDown(event, index)}> {index} </div>
            </div> 
          )
        })
      }
      </Fragment>
    )
  }
  static propTypes = {
    setResponseData: PropTypes.func,
  }
}
export const RectsBox = Context.Provider;
export default props => (
  <Context.Consumer>
    { context => <RectKid {...props} context={context}/>}
  </Context.Consumer> 
)