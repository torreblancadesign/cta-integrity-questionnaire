import React, { useState, useEffect } from "react";
import styles from "../styles/style.module.css";

const Component = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]); // Store the fetched questions

  // Fetch the questions from the Airtable API on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/get-questions');
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleNextQuestion = async () => {
    if (questions.length === 0) return; // Handle the case when questions are not yet loaded

    const currentFieldName = questions[currentQuestion].fieldName;
    const fieldsToSend = { [currentFieldName]: answers[currentFieldName] };

    if (currentQuestion === 0) {
      // First question - Create new Airtable record
      try {
        const response = await fetch('/api/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields: fieldsToSend }),
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
        const response = await fetch('/api/api', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: recordId,
            fields: fieldsToSend,
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
    const currentFieldName = questions[currentQuestion]?.fieldName;
    setAnswers({
      ...answers,
      [currentFieldName]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      {questions.length > 0 ? (
        <>
          <h1 className={styles.heading}>
            {questions[currentQuestion]?.question}
          </h1>
          <input
            type="text"
            value={answers[questions[currentQuestion]?.fieldName] || ""}
            onChange={handleAnswerChange}
            className={styles.input}
          />
          <button onClick={handleNextQuestion} className={styles.button}>
            {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default Component;
 