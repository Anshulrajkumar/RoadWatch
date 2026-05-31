# RoadWatch

RoadWatch is an AI-driven infrastructure monitoring and citizen complaint management platform.

## Features

- **Citizen Complaint Management**: Easily report road issues and track the status of complaints.
- **AI Chatbot Assistant**: Specialized AI assistant for navigating platform features and reporting civic issues.
- **Interactive Dashboard**: View reported road issues and statuses.

## Tech Stack

- **Frontend**: React, Next.js (or Vite)
- **Backend**: Node.js, Express, Serverless Functions
- **Database/Auth**: Supabase
- **AI Integration**: Groq LLM API

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd RoadWatch
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Variables Configuration:**
   - In the `frontend` directory, copy `.env.example` to `.env` (or create a new `.env` file) and add your Supabase variables (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
   - In the `backend` directory, create a `.env` file and add your backend API keys (like Groq API key and Supabase credentials).

5. **Run the Development Servers:**
   - Open two terminal windows.
   - **Start the Frontend:**
     ```bash
     cd frontend
     npm run dev
     ```
   - **Start the Backend:**
     ```bash
     cd backend
     npm start
     ```
