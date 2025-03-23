import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

const API_ENDPOINT =
  "https://your-api-id.execute-api.region.amazonaws.com/stage/";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
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

  useEffect(() => {
    const processTranscription = async () => {
      if (finalTranscription) {
        try {
          setIsLoading(true);

          const userMessage: Message = {
            id: Date.now().toString(),
            content: finalTranscription,
            isUser: true,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, userMessage]);

          const response = await axios.post(`${API_ENDPOINT}chat`, {
            input: finalTranscription,
          });

          if (response.data && response.data.message) {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: response.data.message,
              isUser: false,
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
          }

          setFinalTranscription(null);
        } catch (error) {
          console.error("Error processing audio transcript:", error);

          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Sorry, I couldn't process your message.",
            isUser: false,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    processTranscription();
  }, [finalTranscription]);

  useEffect(() => {
    if (imageUri) {
      const imageMessage: Message = {
        id: Date.now().toString(),
        content: "",
        isUser: true,
        timestamp: new Date(),
        imageUri: imageUri,
      };

      setMessages((prev) => [...prev, imageMessage]);
    }
  }, [imageUri]);

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
