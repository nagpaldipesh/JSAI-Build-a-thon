import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";
import path from "path";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";
const imagePath = path.resolve("contoso_layout_sketch.jpg");

export async function main() {
  // Read and encode the image as base64
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );
    
  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant that writes HTML and CSS code for web pages based on hand-drawn sketches." },
        { role: "user", content: [
            { type: "text", content: "Write HTML and CSS code for the web page based on this hand-drawn sketch." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      temperature: 0.7,
      top_p: 1.0,
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
  if (err && err.body) {
    console.error("Error body:", err.body);
  }
});

