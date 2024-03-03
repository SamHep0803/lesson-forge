"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import { AI } from "./action";
import { Page, Document } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
  },
);

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <div className="h-full w-full">
      {messages.length > 0 && (
        <PDFViewer width={"100%"} height={"100%"}>
          <Document>
            {
              // View messages in UI state
              messages.map((message) => (
                <Page key={message.id}>{message.display}</Page>
              ))
            }
          </Document>
        </PDFViewer>
      )}

      <form
        className="w-full"
        onSubmit={async (e) => {
          e.preventDefault();

          // Submit and get response message
          const responseMessage = await submitUserMessage(inputValue);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);
          console.log(responseMessage);

          setInputValue("");
        }}
      >
        <input
          className="w-full"
          placeholder="Send a message..."
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
      </form>
    </div>
  );
}
