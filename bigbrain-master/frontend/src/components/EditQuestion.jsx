import React, { useState } from 'react';
import { Modal, Checkbox, InputNumber, Input } from 'antd';
import { useNavigate } from 'react-router-dom'
export default function EditQuestion () {
  const nav = useNavigate()
  const token = sessionStorage.getItem('token')
  let questionNumberInput = null
  let timeLimitInput = null
  let questionInput = null
  let answerInput = null
  let pointInput = null
  const [numberOfQuestions, setNumberOfQuestions] = useState(0)
  const [timeLimit, setTimeLimit] = useState(0)
  const [singleQuestion, setSingleQuestion] = useState(true)
  const [isModalEditQ, setisModalEditQ] = useState(true);
  const [checkbox1, setCheckbox1] = useState(true)
  const [checkbox2, setCheckbox2] = useState(false)
  const [page, setPage] = useState(0)
  const [questionList, setQuestionList] = useState([])
  const gameId = Number(window.location.href.slice(-9))
  function editQOK () {
    setNumberOfQuestions(Number(questionNumberInput.value))
    setTimeLimit(Number(timeLimitInput.value))
    setSingleQuestion(checkbox1)
    setisModalEditQ(false)
  }
  function editQCancel () {
    setisModalEditQ(false)
    nav('/dashboard')
  }
  function checkboxClicked () {
    setCheckbox1(!checkbox1)
    setCheckbox2(!checkbox2)
    // checkbox2.input.checked = !checkbox2.input.checked
  }
  function editQustionPageOK () {
    const l1 = questionList
    l1.push({ [questionInput.input.value]: answerInput.input.value, point: Number(pointInput.input.value) })
    setQuestionList(l1)
    if (page !== numberOfQuestions - 1) {
      setPage(page + 1)
    } else {
      const l1 = questionList
      l1.push({ timeLimit })
      l1.push({ singgleFlag: singleQuestion })
      setQuestionList(l1)
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
        } else { alert('edit successfully!') }
        return data
      }).catch(data => {
        alert(data)
      })
      nav('/dashboard')
    }
  }
  function editQustionPageOKCancel () {
    setNumberOfQuestions(0)
    nav('/dashboard')
  }
  if (numberOfQuestions) {
    return (
        <Modal title={'Quetion' + (page + 1)}open={true} onOk={editQustionPageOK} onCancel={editQustionPageOKCancel} >
            <div>Question : <Input ref={(a) => { questionInput = a }}></Input> </div>
            <div>Answer : <Input ref={(a) => { answerInput = a }}></Input> </div>
            <div>Point : <Input ref={(a) => { pointInput = a }}></Input> </div>
        </Modal>
    )
  } else {
    return (
        <Modal title="Edit a new game" open={isModalEditQ} onOk={editQOK} onCancel={editQCancel} >
        <div className='edq_modal'> <span>Please input the number of questions:  </span><InputNumber ref={(a) => { questionNumberInput = a }}></InputNumber></div>
        <div className='edq_modal'><Checkbox onChange={checkboxClicked} checked={checkbox1}>Single Answer</Checkbox> <Checkbox onChange={checkboxClicked} checked={checkbox2}>Multi Answer</Checkbox> </div>
        <div className='edq_modal'> <span>Please input the time limit (minitues):  </span><InputNumber ref={(a) => { timeLimitInput = a }}></InputNumber></div>
        </Modal>
    )
  }
}
