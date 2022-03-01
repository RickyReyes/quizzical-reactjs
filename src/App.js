import logo from './logo.svg';
import './index.css';
import StartGame from './components/StartGame'
import Item from './components/Item'
import { useState, useEffect } from "react"


/* The data retrieved from the API call below contains unwanted character codes. */
function replaceStringCodes(str) {
  return str.replace(new RegExp('&quot;', 'g'), '"')
            .replace(new RegExp('&#039;', 'g'), "'")
            .replace(new RegExp('&ouml;', 'g'), 'ö')
            .replace(new RegExp('&ldquo;', 'g'), '“')
            .replace(new RegExp('&rdquo;', 'g'), '”')
            .replace(new RegExp('&auml;', 'g'), 'ä')
            .replace(new RegExp('&amp;', 'g'), '&')
            .replace(new RegExp('&iacute;', 'g'), 'í')
            .replace(new RegExp('&rsquo;', 'g'), '’')
            .replace(new RegExp('&Eacute;', 'g'), 'É')
            .replace(new RegExp('&hellip;', 'g'), '…')
            .replace(new RegExp('&shy;', 'g'), '-')
}

function App() {
  const [trivia, setTrivia] = useState([])
  const [active, setActive] = useState(true)
  const [score, setScore] = useState(0)
  const [startGame, setStartGame] = useState(true)

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy")
      .then(res => res.json())
      .then(data => {
        setTrivia(processData(data))
      })
  },[])


  function processData(data) {
    console.log('ran')
    let newData = data.results.map((obj, idx) => {
      let size = data.results.length
      let randomIdx = Math.floor(Math.random() * (size + 1))
      let allAnswers = [...obj.incorrect_answers]
      allAnswers.splice(randomIdx, 0, obj.correct_answer)
      allAnswers = allAnswers.map(answer => replaceStringCodes(answer))
      return { ...obj,

              question: replaceStringCodes(obj.question), selected: '', 
              allAnswers: allAnswers,
              correct_answer: replaceStringCodes(obj.correct_answer)
            }
    })
    return newData
  }

  /* selects an answer. */
  function handleSelect(correspObj, answer) {
    let newData = trivia.map(obj => {
      if (obj == correspObj) {
        return {...obj, selected: answer}
      } else {
        return obj
      }
    })
    setTrivia(newData)
  }

  /*  handles start game, submit and new game */
  function handleButton() {
    let allAnswered = trivia.every(obj => {
      return obj.selected != ''
    })
    if (startGame) {
      setStartGame(false)
      return;
    }
    if (!allAnswered) alert("Please finish the quiz.")
    else if (active) {
      setActive(false)
      trivia.forEach(obj => {
        if (obj.correct_answer == obj.selected) {
          setScore(prevScore => prevScore + 1)
        }
      })
    }
    else {
      setActive(true)
      setScore(0)
      fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy")
      .then(res => res.json())
      .then(data => {
        setTrivia(processData(data))
      })
    }
  }

  /* an array of question and answers,
     each of which is referred to as an "Item" */
  const itemElements = trivia.map((obj, idx) => {
    const answerElements = obj.allAnswers.map((answer, idx) => {

      let incorrectStyles = {
        backgroundColor: "#F8BCBC",
        opacity: '0.5'
      }

      let styles = active ? 
      { backgroundColor: answer == obj.selected ? '#D6DBF5' : 'white' } : 
      answer == obj.correct_answer ? { backgroundColor:  '#94D7A2' } : 
      answer == obj.selected && (answer !== obj.correct_answer) ? incorrectStyles : 
      { backgroundColor:  'white' }

    return <li style= {styles}
                key={idx} 
                className="answer"
                onClick={() => handleSelect(obj, answer)}>{answer}</li>
  })

    return (
      <Item key={idx} 
            question={obj.question} 
            answerElements={answerElements}
            />
    )
  })

  return (
    <main>
      <div className="app-container">
        <div className="bg-bottom-left"></div>
        <div className="bg-top-right"></div>
        <h1>Quizzical</h1>
        {startGame && <StartGame />}
        {!startGame && 
        <ul className="item-container">
          {itemElements}
        </ul>}
        <div className="score-and-btn">
          {!active && <span className="score">
            You scored {score} out of {trivia.length}
          </span>}
          <button onClick={handleButton} className="btn">{startGame ? 'Start Game' : active ? 'Check answers' : 'Play again'}</button>
        </div>
      </div>
    </main>
  );
}

export default App;