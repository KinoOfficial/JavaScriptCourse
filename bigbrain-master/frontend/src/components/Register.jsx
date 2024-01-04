import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Form, Input, } from 'antd'
import '../style/style.css'
// import request from '../utils/request'
// import { submit } from '../function/register/submit.js'
// import request from '../utils/request'
export default class Register extends Component {
  onFinish = () => {
    console.log('Success:', 1);
  };

  onFinishFailed = () => {
    console.log('Failed:', 0);
  };

  registerSubmit = () => {
    this.registerForm.validateFields().then((data) => {
      const obj = {
        email: data.username,
        password: data.password,
        name: data.name,
      }
      fetch('http://localhost:5005' + '/admin/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      }).then(json => {
        return json.json()
      }).then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          localStorage.setItem('token', data)
          alert('Successfully register!')
        }
        return data
      }).catch(data => {
        alert(data)
      })
    })
  }

  render () {
    return (
      <div className={'wrap'}>
        <Card title={'Register Page'} style={{ width: 500 }} headstyle={{ textalign: 'center' }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
            ref={(input) => { this.registerForm = input }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" onClick={() => this.registerSubmit()}>
                Submit
              </Button>
              <Link to="/">
              <Button type="primary" htmlType="submit" style={{ marginLeft: 50 }}>
                Back
              </Button>
            </Link>
            </Form.Item>
          </Form>
        </Card>

        {/* <Link to={'/register'}><Button>register</Button></Link> */}
      </div>
    )
  }
}
