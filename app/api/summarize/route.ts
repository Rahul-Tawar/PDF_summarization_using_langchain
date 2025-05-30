import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatOpenAI } from '@langchain/openai';
import { MapReduceDocumentsChain, loadSummarizeChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Load PDF
    const loader = new PDFLoader(buffer);
    const docs = await loader.load();

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    // Create embeddings and vector store
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

    // Create summarization chain
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
    });

    const mapPrompt = new PromptTemplate({
      template: `Write a concise summary of the following text:
      {text}
      CONCISE SUMMARY:`,
      inputVariables: ['text'],
    });

    const combinePrompt = new PromptTemplate({
      template: `Write a comprehensive summary of the following text:
      {text}
      COMPREHENSIVE SUMMARY:`,
      inputVariables: ['text'],
    });

    const chain = loadSummarizeChain(llm, {
      type: 'map_reduce',
      combinePrompt,
      combineMapPrompt: mapPrompt,
    });

    // Generate summary
    const result = await chain.call({
      input_documents: splitDocs,
    });

    return NextResponse.json({ summary: result.text });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Error processing PDF' },
      { status: 500 }
    );
  }
} 