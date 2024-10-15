
# CTA Integrity Questionnaire

This repository hosts the code for the CTA Integrity Questionnaire, a web-based application designed to collect and process questionnaire responses for integrity assessment. The application integrates with Airtable to manage the questionnaire logic and data.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Airtable Integration](#airtable-integration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Dynamic questionnaire with multiple-choice and text fields.
- Logic-based form progression and conditional end screens.
- Integration with Airtable for fetching and storing question data.
- Customizable partner logos and branding.
- Results end pages with dynamic content fetched from Airtable.

## Technologies Used

- **Next.js**: A React-based framework for server-side rendering and static site generation.
- **Airtable API**: Used to retrieve questionnaire data and results logic.
- **JavaScript**: Core language used throughout the application.
- **HTML/CSS**: For structuring and styling the web interface.

## Setup Instructions

To set up the CTA Integrity Questionnaire locally, follow these steps:

### Prerequisites

- Node.js (v14 or higher)
- Airtable account and API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/torreblancadesign/cta-integrity-questionnaire.git
   cd cta-integrity-questionnaire
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file and add the following environment variable:

   ```bash
   AIRTABLE_API_KEY=your_airtable_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the application in your browser:

   ```
   http://localhost:3000
   ```

## Airtable Integration

The questionnaire relies on data stored in Airtable for questions and results. Below are the key Airtable tables:

- **Questionnaire Questions & Options**: Holds the questions, their options, and display order.
- **Partners**: Stores partner-specific branding information.
- **Results End Pages**: Stores the content for the end pages after the questionnaire is completed.

Ensure that you have the appropriate table structure in Airtable to match the app's requirements.

## Usage

1. **Dynamic Questionnaire**: The questions are dynamically loaded from Airtable. Each question is displayed based on the order field. Multiple-choice questions are shown if options are available, and text fields are shown otherwise.

2. **Logic-Based Progression**: After answering the first question, the system checks the `Logic` field in Airtable for each subsequent question. Depending on the value (`Required to File` or `Not Required to File`), the questionnaire either continues or ends.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you find bugs or want to suggest features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
