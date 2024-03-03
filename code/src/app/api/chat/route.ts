import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const newPrompt = [
    {
      role: "system",
      content: `You are a teacher creating a presentation.
      For each slide, create a title, a content, and a natural language description of a suitable graphic for the slide.
      For each slide, it is very important that you separate the title and content and graphic description with a singular }.
      It is very important that the graphic descriptions are as simple as possible.
      It is very important that graphics do not have characters in them.
      Do not use anything other than a singular } to separate the title and content and graphic description.
      The content should be in brief bullet points.
      Each point of the content should start with a dash and end with a line break.
      Do not use a dash anywhere else in the response.
      Do not include any other text other than the title and content and the graphic description.
      It is very important that you always separate each slide with a #.
      Do not start or end the response with a #, it should only be between slides. Do not put a linebreak after the #.`,
    },
    ...messages,
  ];

  console.log(newPrompt);

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    stream: true,
    messages: newPrompt,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
