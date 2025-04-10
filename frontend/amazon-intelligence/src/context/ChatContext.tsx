import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import amplifyConfig from "../../amplify-config";
import { v4 as uuidv4 } from "uuid";
import { usePermissions } from "./PermissionsContext";
import { useAuth } from "./AuthContext";
import "react-native-get-random-values";

const API_ENDPOINT = amplifyConfig.API.REST.API.endpoint;

type Location = {
  latitude: number;
  longitude: number;
  name: string;
};

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
  s3ImageUrl?: string;
};

type ChatContextType = {
  interimTranscription: string | null;
  setInterimTranscription: (text: string | null) => void;
  finalTranscription: string | null;
  setFinalTranscription: (text: string | null) => void;
  clearTranscriptions: () => void;
  messages: Message[];
  clearMessages: () => void;
  isLoading: boolean;
  conversationId: string;
  hasFinishedRecording: boolean;
  setHasFinishedRecording: (hasFinished: boolean) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

const DEFAULT_LOCATION: Location = {
  latitude: 47.6062,
  longitude: -122.3321,
  name: "Seattle, WA",
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [interimTranscription, setInterimTranscription] = useState<
    string | null
  >(null);
  const [finalTranscription, setFinalTranscription] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>(uuidv4());
  const [hasFinishedRecording, setHasFinishedRecording] =
    useState<boolean>(false);
  const { userData } = useAuth();
  const { location } = usePermissions();

  const clearTranscriptions = () => {
    setInterimTranscription(null);
    setFinalTranscription(null);
  };

  const clearMessages = () => {
    setMessages([]);
    // Generate a new conversation ID when clearing messages
    setConversationId(uuidv4());
  };

  // Get current datetime in ISO format with timezone
  const getCurrentDatetime = (): string => {
    const now = new Date();
    return now.toISOString();
  };

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

        // Prepare the request payload according to the specified format
        const payload = {
          input: finalTranscription,
          conversationId: conversationId,
          context: {
            location: location || DEFAULT_LOCATION,
            datetime: getCurrentDatetime(),
            preferences: {
              temperatureUnit: "celsius",
              generalUnits: "metric",
              aiVoice: "Joanna",
              userName: userData?.nickname || "User",
            },
          },
        };

        const response = await axios.post(`${API_ENDPOINT}chat`, payload);

        if (response.data && response.data.message) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.data.message,
            isUser: false,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
        }

        clearTranscriptions();
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

  useEffect(() => {
    processTranscription();
  }, [finalTranscription, conversationId, location, userData]);

  return (
    <ChatContext.Provider
      value={{
        interimTranscription,
        setInterimTranscription,
        finalTranscription,
        setFinalTranscription,
        clearTranscriptions,
        messages,
        clearMessages,
        isLoading,
        conversationId,
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
