import React, { Component } from 'react';
// import logo from './logo.svg';
import {  Modal, Button } from 'antd';
import './App.css';

class App extends Component {
  
  state = { 
    visible: true,
    isDraw: false,
    rects: [],
  }
  box = '';
  isDown = false;
  isResize = false;
  disX = 0;
  disY = 0;
  ix = '';
  
 
  handleMouseDown = (event, index) => {
    this.disX = event.clientX - event.target.offsetLeft;
    this.disY = event.clientY - event.target.offsetTop;
    this.isDown = true;
    this.ix = index;
    console.log(222)
  }
  handleMouseMove = (event) => {
    console.log(event.clientX, this.box.getBoundingClientRect().x, '------====------')
    if(this.isResize) {
      let rWidth = event.clientX - this.box.getBoundingClientRect().x - 35;
      let rHeight = event.clientY - this.box.getBoundingClientRect().y - 35;
      const { rects } = this.state;
      rects[this.ix] = Object.assign({}, rects[this.ix], {width: rWidth, height: rHeight}) 
      this.setState({rects})
      return false;

    }
    if(!this.isDown) return;
    let mx = event.clientX - this.disX;
    let my = event.clientY - this.disY;
    if(mx + 44 > 400) { // 临界为图片的width
      mx = 400-46;
    } else if(mx < 0) {
      mx = 0;
    }
    if(my + 44 > 400) { // 临界为图片的height
      my = 400-46;
    } else if(my < 0) {
      my = 0
    }
    const { rects } = this.state;
    rects[this.ix] = {x: mx, y: my, width: 44, height: 44}
    this.setState({rects})
  }
  handleMouseUp = () => {
    this.isDown = false;
    this.isResize = false;
  }
  handleClick = (event) => {
    const { rects } = this.state;
    let x = event.pageX - this.box.getBoundingClientRect().x;
    let y = event.pageY - this.box.getBoundingClientRect().y;
    let isRepeat = false;
    rects.map((item) => {
      if(x >= item.x && x <= item.x+item.width && y >=item.y && y <= item.y+item.height) {
        isRepeat = true;
      } 
    })
    if(isRepeat) return false;
    rects.push({x, y, width: 44, height: 44})
    this.setState({rects})
  }

  handleResizeMouseMove = (event) => {
    // this.isDown = false;
    // if(!this.isResize) return;
    // let rx = event.clientX - this.disX;
    // let ry = event.clientY - this.disY;
    // console.log(this.disY, 'y')
    // const { rects } = this.state;
    // rects[this.ix] = Object.assign({}, rects[this.ix], {height: this.disY}) 
    // this.setState({rects})
  }
  handleResizeMouseDown = (index) => {
    console.log(index, 'index')
    this.ix = index;
    this.isResize = true;
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

  handleRectDel = (index) => {
    const { rects } = this.state;
    rects.splice(index, 1)
    this.setState({rects})
  }

  render() {
    const { isDraw, rects } = this.state;
    return (
      <div 
        className="App" 
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
        <Button type="primary" onClick={this.showModal}>
          Open Modal
        </Button>
        <Modal
          width={800}
          title="编辑热区图"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button disabled={rects.length === 0 ? true : false} type="primary" onClick={this.handleOk}>确认</Button>,
            <Button onClick={this.handleCancel}>取消</Button>
          ]}
        >
          <div className="box-left">
            <p>请在图片上选择合适的位置创建热区，所划区域不小于44*44px</p>
            <div 
              ref={ref => this.box = ref}
              className="image-box" 
              style={{cursor: isDraw ? 'move' : 'auto'}}
              onClick={this.handleClick}
            >
              {
                rects.map((item, index) => {
                  return(
                    <div 
                      ref={ref => this.rect = ref}
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
                      onMouseDown={(event) => this.handleMouseDown(event, index)}
                    >
                      <div 
                        className="rect-index"
                        onMouseDown={() => this.handleResizeMouseDown(index)}
                      >
                        {index}
                      </div>
                      {/* <div 
                        className="arc" 
                        style={{top: '-5px', right: '50%', marginRight: '-5px'}} 
                        // onMouseMove={this.handleResizeMouseMove}
                        onMouseDown={this.handleResizeMouseDown}
                        onMouseUp={this.handleResizeMouseUp}
                      />
                      <div 
                        className="arc" 
                        style={{left: '-5px', top: '50%', marginTop: '-5px'}}
                        // onMouseMove={this.handleResizeMouseMove}
                        onMouseDown={this.handleResizeMouseDown}
                        onMouseUp={this.handleResizeMouseUp}
                      />
                      <div 
                        className="arc" 
                        style={{bottom: '-5px', right: '50%', marginRight: '-5px'}}
                        // onMouseMove={this.handleResizeMouseMove}
                        onMouseDown={this.handleResizeMouseDown}
                        onMouseUp={this.handleResizeMouseUp}
                      />
                      <div 
                        className="arc" 
                        style={{right: '-5px', top: '50%', marginTop: '-5px'}}
                        // onMouseMove={this.handleResizeMouseMove}
                        onMouseDown={this.handleResizeMouseDown}
                        onMouseUp={this.handleResizeMouseUp}
                      /> */}
                    </div>
                  )
                })
              }
            </div>
          </div> 
          <div className="box-right">
            {
              rects.map((item, index) => {
                return(
                  <div key={index + item} className="right-row">
                    <span>{index}</span>
                    <span className="box-span">添加商品</span>
                    <span className="box-span">添加链接</span>
                    <span onClick={() => this.handleRectDel(index)} className="box-span">删除</span>
                  </div>
                )
              })
            }
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
