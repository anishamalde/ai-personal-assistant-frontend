import React, { createContext, useState, useContext, ReactNode } from "react";

type ChatContextType = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  clearImage: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const clearImage = () => {
    setImageUri(null);
  };

  return (
    <ChatContext.Provider
      value={{
        imageUri,
        setImageUri,
        clearImage,
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
