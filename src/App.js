import React, { Component } from 'react';
// import logo from './logo.svg';
import {  Modal, Button } from 'antd';
import './App.css';
import DrawRect from './drawRect';

class App extends Component {
  
  state = { 
    visible: true,
    isDraw: false,
  }
  canvas = '';
  box = '';
  rects = [];
  timer = '';

  componentDidMount() {

  }
  
  // handleMouseDownCanvas = (event) => {
  //   this.handleMouseMoveCanvas(event);
  //   this.handleMouseUpCanvas = () => {
  //     this.handleMouseMoveCanvas = null;
  //   }
  // }

  handleMouseMoveCanvas = (event) => {
    let x = event.pageX - this.canvas.getBoundingClientRect().x;
    let y = event.pageY - this.canvas.getBoundingClientRect().y;
    // let context = this.canvas.getContext('2d');
    // context.clearRect(0, 0, this.width, this.height);
    // let rect = new DrawRect(x, y, 44, 44, this.canvas);
    // console.log(rect, 'rect')
    // rect.draw();

    this.rects.map((item,index) => {
      if(x >= item.x && x <= item.x+item.width && y >=item.y && y <= item.y+item.height) {
        this.setState({isDraw: true});
      } else {
        this.setState({isDraw: false});
      }
    })
  }

  handleClickCanvas = (event) => {
    let x = event.pageX - this.canvas.getBoundingClientRect().x;
    let y = event.pageY - this.canvas.getBoundingClientRect().y;
    let rect = new DrawRect(x, y, 44, 44, this.canvas);
    rect.draw();
    this.rects.push(rect);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    const { isDraw } = this.state;
    return (
      <div className="App">
        <Button type="primary" onClick={this.showModal}>
          Open Modal
        </Button>
        <Modal
          title="编辑热区图"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          ref={ref => this.box = ref}
        >
          <p>请在图片上选择合适的位置创建热区，所划区域不小于44*44px</p>
          <div className="image-box" style={{cursor: isDraw ? 'move' : 'auto'}}>
            <canvas ref={ref => this.canvas = ref} width='400' height='400' 
              onClick={this.handleClickCanvas} 
              onMouseMove={this.handleMouseMoveCanvas}
              onMouseDown={this.handleMouseDownCanvas}
              onMouseUp={this.handleMouseUpCanvas}
            />
            <div style={{}}/>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
