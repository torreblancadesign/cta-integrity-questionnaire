import React, { useState } from "react";
import styles from "../styles/style.module.css";

const questions = [
  { id: 1, question: "What is your name?", fieldName: "Name of Company" },
  { id: 2, question: "How old are you?", fieldName: "Age" },
  { id: 3, question: "What is your favorite hobby?", fieldName: "Favorite Hobby" },
  { id: 4, question: "What is your occupation?", fieldName: "Occupation" },
  // Add more questions as needed, up to 11 total
];

const Component = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recordId, setRecordId] = useState(null); // Track Airtable record ID

const handleNextQuestion = async () => {
  const currentFieldName = questions[currentQuestion].fieldName;

  if (currentQuestion === 0) {
    // First question - Create new Airtable record
    try {
      const response = await fetch('../pages/api/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: { [currentFieldName]: answers[currentFieldName] } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecordId(data.id); // Store the record ID for future updates
    } catch (error) {
      console.error('Error creating record:', error);
      alert("Failed to submit answers!");
      return;
    }
  } else if (recordId) {
    // For subsequent questions - Update the existing record
    try {
      const response = await fetch('../pages/api/api', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: recordId,
          fields: { [currentFieldName]: answers[currentFieldName] },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error updating record:', error);
      alert("Failed to update answers!");
      return;
    }
  }

  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
  } else {
    alert("Questionnaire completed!");
  }
};

  const handleAnswerChange = (e) => {
    const currentFieldName = questions[currentQuestion].fieldName;
    setAnswers({
      ...answers,
      [currentFieldName]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <h1>{questions[currentQuestion].question}</h1>
      <input
        type="text"
        value={answers[questions[currentQuestion].fieldName] || ""}
        onChange={handleAnswerChange}
        className={styles.input}
      />
      <button onClick={handleNextQuestion} className={styles.button}>
        {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
      </button>
    </div>
  );
};

export default Component;
 