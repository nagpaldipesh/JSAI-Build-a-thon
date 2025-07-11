import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // or '.env.production'
const endpoint = process.env.AZURE_INFERENCE_SDK_ENDPOINT;
const modelName = "gpt-4.1";
const apiKey = process.env.AZURE_INFERENCE_SDK_KEY;

export async function main() {
  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  console.log("endpoint:", endpoint, "api-key:", apiKey); 
  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "I am going to Paris, what should I see?" }
      ],
      max_tokens: 800,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: modelName
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }
  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

