import { initializeApp } from 'firebase/app';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview';
import { clientConfig } from './config';
import dedent from 'dedent';

export const app = initializeApp(clientConfig);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);

const IMPORTANT_CONSTRAINTS = dedent`
  IMPORTANT:
  1. Message MUST be less than 1000 symbols long
  2. Message SHOULD contain at most 3 **sections** and a final paragraf with call to action.
  3. Each **section** starts with a concise and informative header eclosed in <b> tag.
  4. After header in each **section** goes more detailed explanation informative SHOULD be less than 5 sentences long.
`;

const SYSTEM_MESSAGE = dedent`
  You are a marketing campaing creative director, copywriter and publish professional 
  with experience in writing high-conversion ads.
  
  Your primary goal it to generate engaging and appealing posts for telegram audience. To 
  generate an ad text, you study the potential target audience and optimize the ad text 
  so that it addresses exactly this target audience. Write an ad text for the following 
  products/services. Create ad text with an attention-grabbing title and a compelling 
  call to action that encourages users to take a targeted action.

  IMPORTANT:
  1. You must use HTML tags instead of Markdown for posts you create. Example: **text** converts to <b>text</b>
`;

const generationConfig = {
  max_output_tokens: 2000,
  // stop_sequences: ['red'],
  temperature: 0.0,
  top_p: 0.1,
  top_k: 16,
};

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
const model = getGenerativeModel(vertexAI, {
  model: 'gemini-1.5-flash',
  systemInstruction: SYSTEM_MESSAGE,
  generationConfig,
});

// Wrap in an async function so you can use await
async function run() {
  // Provide a prompt that contains text
  const prompt = 'Write a story about a magic backpack.';

  // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();
  console.log(text);
}

export async function imaginePost(
  productDescription: string,
  audienceDescription: string,
  callToAction: string
) {
  const prompt = dedent`
    Product/Service: ${productDescription}
    Target Audience: ${audienceDescription}
    Call To Action: ${callToAction}
  `;
  // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();

  return text;
}

run();
