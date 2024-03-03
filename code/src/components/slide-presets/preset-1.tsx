"use client";

import { View, Text, Image } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { useEffect, useState } from "react";
import OpenAI from "openai";

const tw = createTw({});

export const PresetOne = ({
  title,
  content,
  image,
}: {
  title: string;
  content: string;
  image: string;
}) => {
  const [imageUrl, setImageUrl] = useState(undefined);

  useEffect(() => {
    async function generateImage(prompt: string) {
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setImageUrl(data.url);
    }
    if (image) {
      generateImage(image);
    }
  }, []);

  return (
    <View style={tw("flex-1 min-w-[200pt] p-4 flex-col")}>
      <TitleText title={title} />
      <ContentText content={content.trim()} />
      {imageUrl ? (
        <Image
          src={`data:image/png;base64, '${imageUrl}'`}
          style={tw("w-[160px] h-[160px]")}
        />
      ) : undefined}
    </View>
  );
};

export const TitleText = ({ title }: { title: string }) => {
  return <Text style={tw("text-4xl font-bold")}>{title}</Text>;
};

export const ContentText = ({ content }: { content: string }) => {
  return <Text style={tw("text-lg")}>{content}</Text>;
};
