import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import '../style/style.css';
import { useNavigate } from 'react-router-dom'
import { fileToDataUrl } from '../helpers.js'
export default function EditGame () {
  const token = sessionStorage.getItem('token')
  const nav = useNavigate()
  const gameId = Number(window.location.href.slice(-9))
  const [selectEdit, setselectEdit] = useState()
  let questionInput = null
  let answerInput = null
  let answerInputAdd = null
  let nameInput = null
  let imageInput = null
  // let uploadInput = null
  fetch('http://localhost:5005' + '/admin/quiz/' + gameId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify()
  }).then(json => {
    return json.json()
  }).then(data => {
    if (data.error) {
      alert(data.error)
    } else {
      localStorage.setItem('questionList' + gameId, JSON.stringify(data.questions))
      localStorage.setItem('gameName' + gameId, data.name)
      localStorage.setItem('gameThumbnail' + gameId, data.thumbnail)
      // sessionStorage.setItem('gameNumber',data.quizzes.length)
    }
    return data
  }).catch(data => {
    alert(data)
  })
  function editGameCancel () {
    nav('/dashboard')
  }
  function selectClick (str) {
    setselectEdit(str)
  }
  function selectGameCancel () {
    setselectEdit(null)
  }
  async function editParticularQuestion (question) {
    const answerStr = answerInput.input.value
    // const questionList = null
    const questionList = JSON.parse(localStorage.getItem('questionList' + gameId))
    for (const i in questionList) {
      for (const j in questionList[i]) {
        if (j === question) {
          questionList[i][j] = answerStr
        }
      }
    }
    const obj = {
      questions: questionList
    }
    fetch('http://localhost:5005' + '/admin/quiz/' + gameId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj)
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        localStorage.setItem('questionList' + gameId, JSON.stringify(questionList))
        alert('edit successfully!')
      }
      return data
    }).catch(data => {
      alert(data)
    })
  }
  function deleteParticularQuestion (question) {
    const questionList = JSON.parse(localStorage.getItem('questionList' + gameId))
    for (const i in questionList) {
      for (const j in questionList[i]) {
        if (j === question) {
          questionList.splice(i, 1)
        }
      }
    }
    const obj = {
      questions: questionList
    }
    fetch('http://localhost:5005' + '/admin/quiz/' + gameId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj)
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        localStorage.setItem('questionList' + gameId, JSON.stringify(questionList))
        alert('Delete successfully!')
      }
      return data
    }).catch(data => {
      alert(data)
    })
  }

  function addQuestion () {
    const question = questionInput.input.value
    const answer = answerInputAdd.input.value
    const questionList = JSON.parse(localStorage.getItem('questionList' + gameId))
    questionList.push({ [question]: answer })
    const obj = {
      questions: questionList
    }
    fetch('http://localhost:5005' + '/admin/quiz/' + gameId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj)
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        localStorage.setItem('questionList' + gameId, JSON.stringify(questionList))
        alert('Add successfully!')
      }
      return data
    }).catch(data => {
      alert(data)
    })
  }

  function editImage () {
    const file = imageInput.input.files[0]
    fileToDataUrl(file).then(data => {
      sessionStorage.setItem('imageUrl', data)
    })
  }

  function editMeta () {
    const nameStr = nameInput.input.value
    const imgUrl = sessionStorage.getItem('imageUrl')
    const obj = {
      name: nameStr,
      thumbnail: imgUrl
    }
    fetch('http://localhost:5005' + '/admin/quiz/' + gameId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(obj)
    }).then(json => {
      return json.json()
    }).then(data => {
      if (data.error) {
        alert(data.error)
      } else {
        localStorage.setItem('gameName' + gameId, nameStr)
        alert('edit meta data successfully!')
      }
      return data
    }).catch(data => {
      alert(data)
    })
  }

  if (selectEdit) {
    if (selectEdit === 'select' || selectEdit === 'delete') {
      return (
        <div>
          <Modal open = {true} key = {gameId + 'modal'} footer = {[
                <Button key = "back" onClick = {selectGameCancel}>
                  Return
                </Button>
          ]}>
          <ul>
          { JSON.parse(localStorage.getItem('questionList' + gameId)).map((item, index) => {
            let question = null
            let answer = null
            for (const i in item) {
              question = i
              answer = item[i]
            }
            return (
                <li key={index + 'quetion_li'} className='li_questionEdit'>
                <h2>question name: {question}</h2>
                <h3>question answer: <Input defaultValue= {answer} ref={(a) => { answerInput = a }}></Input></h3>
                <Button onClick={() => { editParticularQuestion(question) }}>edit this question</Button>
                <Button danger='true' onClick={() => { deleteParticularQuestion(question) }}>delete this question</Button>
                </li>
            )
          }) }
          </ul>
          </Modal>
        </div>
      )
    } else {
      if (selectEdit === 'add') {
        return (
          <Modal open = {true} key = {gameId + 'modal'} onOk={addQuestion} onCancel={selectGameCancel}>
          <div>Question : <Input ref={(a) => { questionInput = a }}></Input> </div>
          <div>Answer : <Input ref={(a) => { answerInputAdd = a }}></Input> </div>
          </Modal>
        )
      } else {
        // edit meta
        return (
            <Modal open = {true} key = {gameId + 'modal'} onOk={editMeta} onCancel={selectGameCancel}>
            <div className='div_metaEdit'>Game name : <Input defaultValue= {localStorage.getItem('gameName' + gameId)} ref={(a) => { nameInput = a }}></Input> </div>
            <div className='div_metaEdit'>Image : <Input type="file" onChange={editImage} ref={(a) => { imageInput = a }}></Input> </div>
            </Modal>
        )
      }
    }
  } else {
    return (
      <Modal title = {'Edit a game '} open = {true} onCancel={editGameCancel }
      footer = {[
        <Button key = "back" onClick = {editGameCancel}>
          Return
        </Button>
      ]}
      >
        <div className='editG_div'><Button onClick={() => { selectClick('select') } }>Select a question to edit</Button></div>
        <div className='editG_div'><Button onClick={() => { selectClick('delete') } }>Delete a particular question</Button></div>
        <div className='editG_div'><Button onClick={() => { selectClick('add') } }>Add a new question</Button></div>
        <div className='editG_div'><Button onClick={() => { selectClick('meta') } }>Edit meta data(name and image)</Button></div>
      </Modal>
    )
  }
}
