import {
  ContentText,
  PresetOne,
  TitleText,
} from "@/components/slide-presets/preset-1";
import { runOpenAICompletion } from "@/lib/utils";
import { Text, View } from "@react-pdf/renderer";
import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  render,
} from "ai/rsc";
import OpenAI from "openai";
import { z } from "zod";

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function submitUserMessage(userInput: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);

  const reply = createStreamableUI(<Text>Loading...</Text>);

  const completion = runOpenAICompletion(openai, {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a teacher creating a powerpoint presentation. Use short bulletpoints for each slide. Create a title for each slide.
          If the user is requesting to create a slide, call \`generate_slide\` to generate it. Do not include any other text other than the title, content and prompt.
          `,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],

    functions: [
      {
        name: "generate_slide",
        description:
          "Generate a PDF slide given a prompt. Use this to generate a title and content.",
        parameters: z.object({
          title: z.string(),
          content: z.string(),
        }),
      },
    ],
    temperature: 0.5,
  });

  completion.onFunctionCall("generate_slide", async ({ title, content }) => {
    console.log("title:", title);
    console.log("content:", content);

    reply.done(
      <>
        <TitleText title={title} />
        <ContentText content={content} />
      </>,
    );
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
