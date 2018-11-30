import React, { Component } from 'react';
import {  Modal, Button } from 'antd';
import './App.css';

class HotSpaceModal extends Component {
  
  state = { 
    visible: true,
    rects: [],
  }
  box = ''; // 区域box的ref
  isDown = false; // 是否按下来控制移动
  isResize = false; // 是否拉伸rect
  disX = 0; // 点击的坐标x
  disY = 0; // 点击的坐标y
  ix = 0; // 记录rect的index
  
 
  handleMouseDown = (event, index) => {
    this.disX = event.clientX - event.target.offsetLeft;
    this.disY = event.clientY - event.target.offsetTop;
    this.isDown = true;
    this.ix = index;
  }
  handleMouseMove = (event) => {
    const { rects } = this.state;
    if(this.isResize) { // rect 拉伸
      let rWidth = event.clientX - this.box.getBoundingClientRect().x - rects[this.ix].x;
      let rHeight = event.clientY - this.box.getBoundingClientRect().y - rects[this.ix].y;
      if(rWidth + rects[this.ix].x > 400) { // 临界为图片的width
        rWidth = 400 - rects[this.ix].x - 2;
      }
      if(rHeight + rects[this.ix].y > 400) { // 临界为图片的height
        rHeight = 400 -rects[this.ix].y - 2;
      }
      rects[this.ix] = Object.assign({}, rects[this.ix], {width: rWidth, height: rHeight}) 
    } else { // rect 移动
      if(!this.isDown) return;
      let mx = event.clientX - this.disX;
      let my = event.clientY - this.disY;
      if(mx + rects[this.ix].width > 400) { // 临界为图片的width
        mx = 400 - rects[this.ix].width - 2;
      } else if(mx < 0) {
        mx = 0;
      }
      if(my + rects[this.ix].height > 400) { // 临界为图片的height
        my = 400 - rects[this.ix].height - 2;
      } else if(my < 0) {
        my = 0;
      }
      rects[this.ix] = Object.assign({}, rects[this.ix], {x: mx, y: my})
    }
    this.setState({rects})
  }
  handleMouseUp = () => {
    this.isDown = false; 
    this.isResize = false;
  }

  handleClick = (event) => {
    const { rects } = this.state;
    let x = event.clientX - this.box.getBoundingClientRect().x;
    let y = event.clientY - this.box.getBoundingClientRect().y;
    let isRepeat = false;
    rects.map((item) => { // 判断是否重复
      if(x >= item.x && x <= item.x+item.width && y >=item.y && y <= item.y+item.height) {
        isRepeat = true;
      } 
    })
    if(isRepeat) return false;
    rects.push({x, y, width: 44, height: 44})
    this.setState({rects})
  }

  handleResizeMouseDown = (index) => {
    this.ix = index;
    this.isResize = true;
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
    const { rects } = this.state;
    return (
      <div 
        className="hot-space" 
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
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

export default HotSpaceModal;
