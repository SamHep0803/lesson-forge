"use client";

import { PDFViewer, Document, Page, View, Text } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({});

export default function Pdf() {
  return (
    <Document>
      <Page size={[1280, 720]} style={tw("p-4 flex flex flex-wrap gap-4")}>
        <View>
          <Text>Test test</Text>
        </View>
      </Page>
      <Page size={[1280, 720]} style={tw("p-4 flex flex flex-wrap gap-4")}>
        <View>
          <Text>Test test</Text>
        </View>
      </Page>
    </Document>
  );
}
