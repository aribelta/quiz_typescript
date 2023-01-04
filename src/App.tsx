import React, {useState} from 'react';
import { fetchQuizQuestions } from './API';
 import QuestionCard from './components/QuestionCard';
import { QuestionState, difficulty } from './API';

import { GlobalStyle, Wrapper } from './App.styles';


const TOTAL_QUESTIONS = 10;


 export type answerObject = {
  questions: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
 }
function App() {
  const [loading, setLoading] = useState(false);
  const [question,setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswer, setUserAnswers] = useState<answerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(question)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      const answer = e.currentTarget.value;
      const correct = question[number].correct_answer === answer;
      if(correct) setScore(prev => prev + 1)

      const answerObject = {
        questions: question[number].question,
        answer,
        correct,
        correctAnswer: question[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }
  
  return (
  <>
  <GlobalStyle />
    <Wrapper>
    <h1>REACT QUIZ</h1>
    {gameOver || userAnswer.length === TOTAL_QUESTIONS ? (
    <button className='start' onClick={startTrivia}>
      Start
    </button>
     ) : null}
    {!gameOver ? <p className='score'>Score : {score}</p> : null}
    {loading && <p>Loading Questions...</p>}
    { !loading && !gameOver  && (
    <QuestionCard
      questionNum={number + 1}
      totalQuestions={TOTAL_QUESTIONS}
      question= {question[number].question}
      answers= {question[number].answers}
      userAnswer= {userAnswer ? userAnswer[number] : undefined}
      callback={checkAnswer}
    />)}
    {!gameOver && !loading && userAnswer.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? 
     ( 
     <button className='next' onClick={nextQuestion}>
      Next Question
    </button>
  ) : null}
    </Wrapper>
    </>
    );
}

export default App;
