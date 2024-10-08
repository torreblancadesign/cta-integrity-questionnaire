import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'; // Import useRouter to access URL parameters
import styles from "../styles/style.module.css";

const Component = () => {
  const router = useRouter();
  const { id } = router.query; // Get the "id" from the URL
  const [partner, setPartner] = useState(null); // Store the partner information
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]); // Store the fetched questions
  const [recordId, setRecordId] = useState(null); // Track the Airtable record ID
  const [results, setResults] = useState(null); // Store the results (end screen content)
  const [resultsPage, setResultsPage] = useState(null); // Store the fetched results page content
  const [showInitialPage, setShowInitialPage] = useState(true); // Show the initial page before the questionnaire
  const [initialPageText, setInitialPageText] = useState(""); // Store initial page text

  // Fetch the partner info when the "id" is available
  useEffect(() => {
    if (!id) return; // Don't fetch if the id is not available

    const fetchPartner = async () => {
      try {
        const response = await fetch(`/api/get-partner?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch partner");
        }
        const data = await response.json();
        setPartner(data);
      } catch (error) {
        console.error("Error fetching partner:", error);
      }
    };

    fetchPartner();
  }, [id]); // Run this effect when the "id" changes

  // Fetch the initial page text from Airtable
  useEffect(() => {
    const fetchInitialPage = async () => {
      try {
        const response = await fetch(`/api/get-results-page?pageName=Initial Page`);
        const data = await response.json();
        setInitialPageText(data.resultsText);
      } catch (error) {
        console.error("Error fetching initial page:", error);
      }
    };

    fetchInitialPage();
  }, []);

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

  // Fetch the results page content dynamically
  const fetchResultsPage = async (pageName) => {
    try {
      const response = await fetch(`/api/get-results-page?pageName=${pageName}`);
      const data = await response.json();
      setResultsPage(data);
    } catch (error) {
      console.error("Error fetching results page:", error);
    }
  };

  const handleNextQuestion = async () => {
    if (questions.length === 0) return; // Handle the case when questions are not yet loaded

    const currentFieldName = questions[currentQuestion]?.fieldName;
    const fieldsToSend = { [currentFieldName]: answers[currentFieldName] };

    if (currentQuestion === 0) {
      // First question - Create new Airtable record, include the "Partners" field with linked record
      const fieldsWithPartner = {
        ...fieldsToSend,
        Partners: [id] // Link the partner record using the raw id from the URL
      };

      try {
        const response = await fetch('/api/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields: fieldsWithPartner }),
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

      // Check the "Logic" field from Airtable to determine the next action
      try {
        const logicResponse = await fetch(`/api/get-logic?id=${recordId}`);
        const logicData = await logicResponse.json();
        const logicValue = logicData.logic; // Get the "Logic" field value

        if (logicValue === "Not Required to File") {
          // Fetch content for the "Not Required to File" results page
          fetchResultsPage("Not Required to File");
          setResults("Not Required to File");
          return;
        }
      } catch (error) {
        console.error('Error fetching logic:', error);
      }
    }

    // If we have more questions, move to the next one
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Fetch content for the "Required to File" results page
      fetchResultsPage("Required to File");
      setResults("Required to File");
    }
  };

  const handleAnswerChange = (e) => {
    const currentFieldName = questions[currentQuestion]?.fieldName;
    setAnswers({
      ...answers,
      [currentFieldName]: e.target.value,
    });
  };

  const handleOptionSelect = (e) => {
    const currentFieldName = questions[currentQuestion]?.fieldName;
    setAnswers({
      ...answers,
      [currentFieldName]: e.target.value,
    });
  };

  // Function to start the questionnaire and hide the initial page
  const startQuestionnaire = () => {
    setShowInitialPage(false);
  };

  return (
    <>
      {/* Always render the navbar */}
      <nav className={styles.navbar}>
        {partner && (
          <div className={styles.navContent}>
            {partner.logo && (
              <img
                src={partner.logo[0].url}
                alt={partner.partnerName}
                className={styles.partnerLogo}
              />
            )}
            <span className={styles.partnerName}>{partner.partnerName}</span>
          </div>
        )}
      </nav>

      <div className={styles.container}>
        {/* Show the initial page if set */}
        {showInitialPage ? (
          <>
            <div className={styles.initialPage}>
              {partner && (
                <img
                  src={partner.logo[0].url}
                  alt={partner.partnerName}
                  className={styles.initialLogo}
                />
              )}
              <p>{initialPageText}</p>
              <button onClick={startQuestionnaire} className={styles.button}>
                Start
              </button>
            </div>
          </>
        ) : resultsPage ? (
          <>
            <h1>{results}</h1>
            <p>{resultsPage.resultsText}</p>
            {resultsPage.buttonName && resultsPage.buttonLink && (
              <a href={resultsPage.buttonLink} className={styles.button}>
                {resultsPage.buttonName}
              </a>
            )}
          </>
        ) : (
          questions.length > 0 && questions[currentQuestion] ? (
            <>
              <h1 className={styles.heading}>
                {questions[currentQuestion]?.question}
              </h1>

              {/* Render description if available */}
              {questions[currentQuestion]?.description && (
                <p className={styles.description}>
                  {questions[currentQuestion].description}
                </p>
              )}

              {/* Check if there are options for the current question */}
              {questions[currentQuestion].options?.length > 0 ? (
                <select
                  value={answers[questions[currentQuestion]?.fieldName] || ""}
                  onChange={handleOptionSelect}
                  className={styles.input}
                >
                  <option value="">Select an option</option>
                  {questions[currentQuestion].options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={answers[questions[currentQuestion]?.fieldName] || ""}
                  onChange={handleAnswerChange}
                  className={styles.input}
                />
              )}
              <button onClick={handleNextQuestion} className={styles.button}>
                {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
              </button>
            </>
          ) : (
            <p>Loading questions...</p>
          )
        )}
      </div>
    </>
  );
};

export default Component;

 