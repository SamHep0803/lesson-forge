import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const image = await openai.images.generate({
    prompt,
    n: 1,
    size: "512x512",
    response_format: "b64_json",
  });

  return Response.json({ url: image.data[0].b64_json });
}
