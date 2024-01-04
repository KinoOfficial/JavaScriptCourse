import { PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Button, Modal, Input, InputNumber } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../style/style.css';
const { Header, Content, Footer, Sider } = Layout;
let nameInput = null
let idInput = null
let numberInput = null
const Dashboard = () => {
  const token = sessionStorage.getItem('token')
  // const [gameNumber, setGameNumber] = useState(sessionStorage.getItem('gameNumber'));
  // useEffect(() => {}, [gameNumber])
  async function getGameList (token) {
    await fetch('http://localhost:5005' + '/admin/quiz', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify()
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        localStorage.setItem('gameList', JSON.stringify(data.quizzes))
        // sessionStorage.setItem('gameNumber',data.quizzes.length)
      }
      return data
    }).catch(data => {
      alert(data)
    })
  }
  getGameList(token)
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [goToResultOpen, setGoToResultOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const showModalAdd = () => {
    setIsModalOpenAdd(true);
  };
  const showModalDelete = () => {
    setIsModalOpenDelete(true);
  };
  const handleOkAdd = () => {
    const gameName = nameInput.input.value
    const questionNumber = Number(numberInput.value)
    // setIsModalOpen(false);
    addNewGame(gameName, questionNumber)
    setIsModalOpenAdd(false);
    navigate('/dashboard')
  };
  const handleOkDelete = () => {
    const gameId = idInput.input.value
    // setIsModalOpen(false);
    deleteGame(Number(gameId))
    setIsModalOpenDelete(false);
    navigate('/dashboard')
  };
  const handleCancelAdd = () => {
    setIsModalOpenAdd(false);
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  function getItem (label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem('Dashboard', '1', <PieChartOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
      getItem('Tom', '3'),
      getItem('Bill', '4'),
      getItem('Alex', '5'),
    ]),
  ];
  const navigate = useNavigate()
  // 2.1.3. Logout Button
  function logout () {
    fetch('http://localhost:5005' + '/admin/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify()
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        alert('Successfully Logout!')
        navigate('/')
      }
      return data
    }).catch(data => {
      alert(data)
    })
  }

  async function addNewGame (name, number) {
    const obj = {
      name,
      number
    }
    await fetch('http://localhost:5005' + '/admin/quiz/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj)
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        alert('Adding a new game successfully!')
      }
      return data
    }).catch(data => {
      alert(data)
    })
  }
  async function deleteGame (id) {
    const obj = {
      quizid: id
    }
    await fetch('http://localhost:5005' + '/admin/quiz/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj)
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        alert('Deleting a game successfully!')
      }
      return data
    }).catch(data => {
      alert(data)
    })
  }
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  JSON.parse(localStorage.getItem('gameList')).map((game) => {
    fetch('http://localhost:5005' + '/admin/quiz/' + game.id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify()
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        sessionStorage.setItem('gameNumber' + game.id, data.questions.length)
      }
      return data
    }).catch(data => {
      alert(data)
    })
    return 1
  })
  function startStopGame (gamdId) {
    // stop the game
    if (sessionStorage.getItem('gameStart' + gamdId)) {
      sessionStorage.setItem('gameStart' + gamdId, '')
      fetch('http://localhost:5005' + '/admin/quiz/' + gamdId + '/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify()
      }).then(json => {
        return json.json()
      }).then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          alert('Successfully Stop!')
          setGoToResultOpen(true)
        }
        return data
      }).catch(data => {
        alert(data)
      })
    } else {
      sessionStorage.setItem('gameStart' + gamdId, true)
      fetch('http://localhost:5005' + '/admin/quiz/' + gamdId + '/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify()
      }).then(json => {
        return json.json()
      }).then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          alert('Successfully Start!')
        }
        return data
      }).catch(data => {
        alert(data)
      })
    }
  }
  function goToResultOk () {
    setGoToResultOpen(false)
    setResultOpen(true)
  }
  function goToResultOkCancel () {
    setGoToResultOpen(false)
  }
  function resultOk () {
    setResultOpen(false)
  }
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Button danger='true' style={{
          width: '10%',
          marginTop: -50,
          backgroundColor: 'red',
          color: 'white',
          marginLeft: '90%'
        }} onClick={logout}>logout</Button>
        <Button type="primary" style={{ marginTop: 50, marginBottom: 50 }} onClick={showModalAdd}>Create a new game +</Button>
        <Modal title="Create a new game" open={isModalOpenAdd} onOk={handleOkAdd} onCancel={handleCancelAdd}>
        <div className="mgb_30"><span>Game name: </span><Input ref={(a) => { nameInput = a }}></Input></div>
        <div className="mgb_30"><span>Number of Question: </span><InputNumber ref={(a) => { numberInput = a }}></InputNumber></div>
      </Modal>
      <Button danger='true' style={{ marginBottom: 50 }} onClick={showModalDelete}>Delete a game -</Button>
        <Modal title="Delete a game" open={isModalOpenDelete} onOk={handleOkDelete} onCancel={handleCancelDelete}>
        <span>gameID: </span><Input ref={(a) => { idInput = a }}></Input>
      </Modal>
      <Modal title="Go to Result Page?" open={goToResultOpen} onOk={goToResultOk} onCancel={goToResultOkCancel}>
        <span>Would you like to go to result page?</span>
      </Modal>
      <Modal title="Result Page" open={resultOpen} onOk={resultOk} onCancel={resultOk}>
        <span>This is result page</span>
      </Modal>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
          <ul className="ul_game">
          { JSON.parse(localStorage.getItem('gameList')).map((item, index) => {
            return <li key={index} className='li_game'>
              <div className='flex_center mgb_10'><img src={item.thumbnail ? item.thumbnail : require('../img/quiz_default.png')} className='img_game'></img></div>
              <div className='flex_center mgb_10'><h3>Game name : {item.name}</h3></div>
              <div className='flex_center mgb_10'><h4>Number of Question(s): {sessionStorage.getItem('gameNumber' + item.id)}</h4></div>
              <div className='flex_center mgb_10'><Button style={ { backgroundColor: '#DCE2F1' } } href = {'/editgame?id=' + item.id}>edit the game</Button></div>
              <div className='flex_center mgb_10'><Button disabled={Boolean(sessionStorage.getItem('gameNumber' + item.id))} style={ { backgroundColor: '#C7EDCC' } } href = {'/editquestion?id=' + item.id} >edit the question</Button></div>
              <div className='flex_center mgb_10'><Button danger={(sessionStorage.getItem('gameStart' + item.id))} onClick={ () => { startStopGame(item.id) } } >{(sessionStorage.getItem('gameStart' + item.id)) ? 'Stop this game' : 'Start this game'}</Button></div>
              </li>
          }) }
        </ul>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
