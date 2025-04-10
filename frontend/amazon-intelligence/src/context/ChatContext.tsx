import React, { createContext, useState, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import "react-native-get-random-values";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
  s3ImageUrl?: string;
};

type ChatContextType = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  clearImage: () => void;
  interimTranscription: string | null;
  setInterimTranscription: (text: string | null) => void;
  finalTranscription: string | null;
  setFinalTranscription: (text: string | null) => void;
  clearTranscriptions: () => void;
  messages: Message[];
  clearMessages: () => void;
  isLoading: boolean;
  hasFinishedRecording: boolean;
  setHasFinishedRecording: (hasFinished: boolean) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [interimTranscription, setInterimTranscription] = useState<
    string | null
  >(null);
  const [finalTranscription, setFinalTranscription] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFinishedRecording, setHasFinishedRecording] =
    useState<boolean>(false);

  const clearImage = () => {
    setImageUri(null);
  };

  const clearTranscriptions = () => {
    setInterimTranscription(null);
    setFinalTranscription(null);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        imageUri,
        setImageUri,
        clearImage,
        interimTranscription,
        setInterimTranscription,
        finalTranscription,
        setFinalTranscription,
        clearTranscriptions,
        messages,
        clearMessages,
        isLoading,
        hasFinishedRecording,
        setHasFinishedRecording,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === null) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
