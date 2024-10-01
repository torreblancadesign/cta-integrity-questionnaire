```javascript
import React, { useState } from "react";
import styles from "../styles/style.module.css";

const questions = [
  { id: 1, question: "What is your name?" },
  { id: 2, question: "How old are you?" },
  { id: 3, question: "What is your favorite hobby?" },
  { id: 4, question: "What is your occupation?" }
];

const Component = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Call API to save the answers when all questions are answered
      try {
        const response = await fetch('/api/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers),
        });
        const data = await response.json();
        console.log(data); // just to see the server response on the console
        alert("Answers submitted!");
      } catch (error) {
        console.error('Error submitting answers:', error);
        alert("Failed to submit answers!");
      }
    }
  };

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
     