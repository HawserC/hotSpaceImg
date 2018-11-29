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
  disX = 0;
  disY = 0;
  ix = '';
  
  handleMouseDown = (event, index) => {
    this.disX = event.clientX - event.target.offsetLeft;
    this.disY = event.clientY - event.target.offsetTop;
    this.isDown = true;
    this.ix = index;
  }
  handleMouseMove = (event) => {
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
    this.setState({rects: [{x: mx, y: my, width: 44, height: 44}]})
  }
  handleMouseUp = () => {
    this.isDown = false;
  }

  handleClick = (event) => {
    const { rects } = this.state;
    let x = event.pageX - this.box.getBoundingClientRect().x;
    let y = event.pageY - this.box.getBoundingClientRect().y;
    let isRepeat = false;
    rects.map((item,index) => {
      if(x >= item.x && x <= item.x+item.width && y >=item.y && y <= item.y+item.height) {
        isRepeat = true;
      } 
    })
    if(isRepeat) return false;
    rects.push({x, y, width: 44, height: 44})
    this.setState({rects})
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
            <Button disabled={rects.length == 0 ? true : false} type="primary" onClick={this.handleOk}>确认</Button>,
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
                      key={index} 
                      style={{
                        width: item.width,
                        height: item.height,
                        position: 'absolute',
                        top: item.y,
                        left: item.x,
                        background: 'rgba(102, 170, 255, .2)',
                        border: 'rgb(102, 170, 255) solid 1px',
                        cursor: 'move'
                      }}
                      onMouseDown={(event) => this.handleMouseDown(event, index)}
                    >
                    <span>{index}</span>
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
                    <span>添加商品</span>
                    <span>添加链接</span>
                    <span onClick={() => this.handleRectDel(index)}>删除</span>
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
