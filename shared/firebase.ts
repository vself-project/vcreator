import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import { clientConfig } from "./config";

export const app = initializeApp(clientConfig);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

// Wrap in an async function so you can use await
async function run() {
  // Provide a prompt that contains text
  const prompt = "Write a story about a magic backpack.";

  // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();
  console.log(text);
}

export async function imaginePost(prompt: string) {
  // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();

  return text;
}

run();
