import React from 'react';
import PropTypes from 'prop-types';
import './App.css';

const {Provider, Consumer} = React.createContext({
  refRect: {},
  rects: [], 
  ix: 0,
  motionType: '',
  setResponseData: () => {}
});
class ContextProvider extends React.Component{
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object.isRequired,
  }
  refRect = React.createRef();

  setResponseData = (rects=[], params={}) => {
    this.setState({rects, ...params})
  }
  handleMouseDown = (event) => {
    const { rects } = this.state;
    let x, y, isRepeat = false;
    x = event.pageX - this.refRect.current.offsetLeft;
    y = event.pageY - this.refRect.current.offsetTop;
    rects.map(item => { // 判断是否重复
      if(x >= item.x && x <= item.x+item.width && y >= item.y && y <= item.y+item.height) {
        isRepeat = true;
      }
    })
    if(isRepeat) return false;
    rects.push({x, y, width: 44, height: 44});
    this.setState({rects, motionType: 'resize'})
  }
  handleMouseMove = (event) => {
    const { rects, ix, disX, disY, motionType } = this.state;
    if(!motionType) return;
    let oWidth = this.refRect.current.offsetWidth;
    let oHeight= this.refRect.current.offsetHeight;
    let xWidth, yHeight, mx, my, mv;
    if(motionType === 'resize') { // rect 拉伸
      mx = event.clientX - this.refRect.current.getBoundingClientRect().x - rects[ix].x;
      my = event.clientY - this.refRect.current.getBoundingClientRect().y - rects[ix].y;
      xWidth = rects[ix].x;
      yHeight = rects[ix].y;
    } 
    if(motionType === 'move') { // rect 移动
      mx = event.clientX - disX;
      my = event.clientY - disY;
      xWidth = rects[ix].width;
      yHeight = rects[ix].height;
    }
    if(mx + xWidth > oWidth) { // 判断临界
      mx = oWidth - xWidth - 2;
    } else if(mx < 0) {
      mx = 0;
    }
    if(my + yHeight > oHeight) { // 判断临界
      my = oHeight - yHeight - 2;
    } else if(my < 0) {
      my = 0;
    }
    mv = motionType === 'resize' 
        ? {width: mx, height: my}
        : {x: mx, y: my}
    rects[ix] = Object.assign({}, rects[ix], mv)
    this.setState({rects})
  }
  handleMouseLeave = () => {
    const { motionType } = this.state;
    !!motionType && this.handleMoveEnd();
  }
  handleMouseUp = () => {
    this.handleMoveEnd();
  }
  handleMoveEnd = () => {
    const { rects, ix } = this.state;
    if(!!rects[ix] && (rects[ix].width < 44 || rects[ix].height < 44)) {
      rects[ix] = Object.assign({}, rects[ix], {width: 44, height: 44})
    }
    if(!!rects[ix] && (rects[ix].x > this.refRect.current.offsetWidth - 44 )) {
      rects[ix] = Object.assign({}, rects[ix], {x: this.refRect.current.offsetWidth - 44})
    }
    if(!!rects[ix] && rects[ix].y > this.refRect.current.offsetHeight - 44) {
      rects[ix] = Object.assign({}, rects[ix], {y: this.refRect.current.offsetHeight - 44})
    }
    let params = {rects, motionType: null, ix: rects.length};
    this.setState(params)
  }
  state = {
    rects: [],  
    disX: null,
    disY: null,
    ix: 0,
    motionType: null,
    setResponseData: this.setResponseData
  }
  render() {
    const { children, style } = this.props;
    return (
        <Provider value={{...this.state, refRect: this.refRect}}> 
          <div 
            ref={this.refRect} 
            className="image-box" 
            style={{...style}} 
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
            onMouseUp={this.handleMouseUp}
          >{children}</div> 
        </Provider>
    )
  }
}
class ContextConsumer extends React.Component{
  state = {
    rects: []
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { context } = nextProps;
    const { rects, motionType } = prevState;
    if(context.rects.length !== rects.length || context.motionType !== motionType) {
      return {rects: [...nextProps.context.rects]}
    }
    return {}
  }
  render() {
    const { context, children } = this.props;
    const { rects } = this.state;
    return children({
      ...context, 
      rects,
      setResponseData: data => context.setResponseData(data.rects, data.params)
    });
  }
}
export default class extends React.PureComponent<{}> {
  static Provider = ContextProvider;
  static Consumer = props => <Consumer>{context => <ContextConsumer context={context} {...props}/>}</Consumer>
};