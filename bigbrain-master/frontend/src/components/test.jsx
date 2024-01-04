import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Checkbox, Form, Input } from 'antd'
import '../style/style.css'


import React from 'react'
function loginSubmit(){
    this.loginForm.validateFields().then((data) => {
      const obj = {
        email: data.username,
        password: data.password,
        name: data.name,
      }
      fetch('http://localhost:5005' + '/admin/auth/login', {
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
          alert('Successfully Login!')
        }
        return data
      }).catch(data => {
        alert(data)
      })
    })
  }

function test() {
        return (
        <div className={'wrap'}>
        <Card title={'Big Brain Master'} style={{ width: 500 }} headstyle={{ textalign: 'center' }}>
        <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        ref={(input) => { this.loginForm = input } }
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
    
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
    
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" onClick={loginSubmit}>
            Submit
          </Button>
          <Link to={'/register'} >
          <Button type="primary" htmlType="submit" style={{ marginLeft: 50 }}>
            Register
          </Button>
          </Link>
        </Form.Item>
      </Form>
        </Card>
    
        {/* <Link to={'/register'}><Button>register</Button></Link> */}
        </div>
        )
}

export default test
