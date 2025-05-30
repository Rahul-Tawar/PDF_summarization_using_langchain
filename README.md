# PDF Summarization with RAG

A Next.js application that uses Langchain and OpenAI to summarize PDF documents using Retrieval-Augmented Generation (RAG).

## Features

- Drag-and-drop PDF upload interface
- PDF text extraction and chunking
- Vector embeddings generation using OpenAI
- Map-reduce summarization with custom prompts
- In-memory vector store for document retrieval
- Modern, responsive UI with Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-summarization-rag
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. Open the application in your web browser
2. Drag and drop a PDF file onto the upload area or click to select a file
3. Wait for the processing to complete
4. View the generated summary

## Screenshots

1. Drag-and-drop PDF upload interface 
![](/public/UploadInstance.png)

2. Summary Instance

![](/public/SummaryInstance.png)

3. Chat Interface

![](/public/ChatInterface.png)

## Architecture

The application uses a modern tech stack:

- **Frontend**: Next.js 14 with React and TypeScript
- **UI**: Tailwind CSS for styling
- **PDF Processing**: Langchain's PDFLoader
- **Text Processing**: Langchain's text splitters and chains
- **Embeddings**: OpenAI's embedding model
- **Vector Store**: In-memory vector store (can be upgraded to persistent storage)
- **Summarization**: Map-reduce chain with custom prompts
