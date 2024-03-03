"use client";

import {
  ContentText,
  PresetOne,
  TitleText,
} from "@/components/slide-presets/preset-1";
import { Document, Image, Page, Text } from "@react-pdf/renderer";
import { useChat } from "ai/react";
import dynamic from "next/dynamic";
import { IBM_Plex_Sans_KR } from "next/font/google";
import OpenAI from "openai";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
  },
);

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  console.log(messages);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4 p-4">
      <PDFViewer height={"100%"} width={"100%"}>
        <Document>
          {!isLoading &&
            messages.length > 1 &&
            messages
              .filter((m) => m.role !== "user")
              .splice(-1)
              .map((m) => {
                const pages = m.content.split("#");

                return pages.map((page) => {
                  const sections = page.split("}");

                  return (
                    <Page size={[960, 540]} id={m.id}>
                      <PresetOne
                        title={sections[0]}
                        content={sections[1]}
                        image={sections[2]}
                      />
                    </Page>
                  );
                });
              })}
        </Document>
      </PDFViewer>

      <form onSubmit={handleSubmit}>
        <input
          className="w-[500px] rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
