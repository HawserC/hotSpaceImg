import React, { Component } from 'react';
// import logo from './logo.svg';
import {  Modal, Button } from 'antd';
import './App.css';

class App extends Component {
  
  state = { 
    visible: true,
    isDraw: false,
    rects: []
  }
  box = '';

  componentDidMount() {

  }
 

  handleMouseMove = (event) => {
    let x = event.pageX - this.canvas.getBoundingClientRect().x;
    let y = event.pageY - this.canvas.getBoundingClientRect().y;

    this.state.rects.map((item,index) => {
      if(x >= item.x && x <= item.x+item.width && y >=item.y && y <= item.y+item.height) {
        this.setState({isDraw: true});
      } else {
        this.setState({isDraw: false});
      }
    })

  }

  handleClick = (event) => {
    const { rects } = this.state;
    let x = event.pageX - this.box.getBoundingClientRect().x;
    let y = event.pageY - this.box.getBoundingClientRect().y;
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
      <div className="App">
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
                        border: 'rgb(102, 170, 255) solid 1px'
                      }}
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
                  <div key={index} className="right-row">
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
