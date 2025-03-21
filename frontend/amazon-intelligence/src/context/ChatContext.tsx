import React, { createContext, useState, useContext, ReactNode } from "react";

type ChatContextType = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  clearImage: () => void;
  audioTranscription: string | null;
  setAudioTranscription: (uri: string | null) => void;
  clearAudio: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [audioTranscription, setAudioTranscription] = useState<string | null>(
    null
  );

  const clearImage = () => {
    setImageUri(null);
  };

  const clearAudio = () => {
    setAudioTranscription(null);
  };

  return (
    <ChatContext.Provider
      value={{
        imageUri,
        setImageUri,
        clearImage,
        audioTranscription,
        setAudioTranscription,
        clearAudio,
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
