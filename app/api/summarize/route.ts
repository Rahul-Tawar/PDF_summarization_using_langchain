import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatOpenAI } from '@langchain/openai';
import { loadSummarizationChain } from 'langchain/chains';
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

    // Convert File to Blob
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    // Load PDF
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    // Create LLM instance
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
    });

    // Create prompts
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

    // Create summarization chain
    const chain = loadSummarizationChain(llm, {
      type: 'map_reduce',
      combinePrompt: combinePrompt,
      mapPrompt: mapPrompt,  // Fixed parameter name
    });

    // Generate summary
    const result = await chain.invoke({
      input_documents: splitDocs,
    });

    return NextResponse.json({ summary: result.text });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing PDF' },
      { status: 500 }
    );
  }
}