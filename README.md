# AI Personal Assistant Device: Frontend

The React Native (Expo) frontend for an AI personal assistant you can talk to, show things to, and hear back from. It was built live, feature by feature, for the talk **Building a Personal AI Device**.

[![Building a Personal AI Device](https://i.ytimg.com/vi/_l6QRqCeTcg/hqdefault.jpg)](https://www.youtube.com/watch?v=_l6QRqCeTcg)

Watch the talk on YouTube: https://www.youtube.com/watch?v=_l6QRqCeTcg

## What it does

- **Voice in.** Tap the mic, speak, and on-device speech recognition turns it into text
- **Chat.** Sends the transcription to your AI backend and shows the conversation as chat bubbles
- **Camera.** Take a photo; it's compressed, uploaded to S3, and the assistant describes it
- **Voice out.** Replies are read aloud with Amazon Polly, using the voice you pick
- **Context.** Each request includes location, date and time, preferred units, and your name, so answers feel personal
- **Sign in.** Amazon Cognito auth through AWS Amplify, with an ID token on every API call
- Runs on iOS, Android, and web

## Repo layout

```
frontend/amazon-intelligence/   The Expo app (see its README for detailed setup)
  amplify-config.ts             Cognito, S3, API, and Polly config (read from .env)
  src/context/                  Auth, Chat, Permissions, Preferences state
  src/hooks/usePollyVoice.tsx   Text to speech with Amazon Polly
  src/navigation/screens/       Home, Chat, Camera, Profile, Login
```

## The backend (not included)

This repo is **frontend only**. The app talks to an AWS backend that you need to build and deploy separately. During the talk, that backend was just an endpoint the app pointed at. To run the app end to end, you'll need:

| AWS resource | What the app uses it for |
|---|---|
| **Cognito User Pool** + app client | Sign in. Enable `USER_PASSWORD_AUTH` on the app client. The app shows the user's `nickname` attribute. |
| **Cognito Identity Pool** | Temporary AWS credentials for the signed-in user. The authenticated role needs `polly:SynthesizeSpeech` and S3 access to `private/${cognito-identity.amazonaws.com:sub}/*`. |
| **S3 bucket** | Photo uploads, stored under `private/<identityId>/images/<conversationId>/`. |
| **API Gateway (REST)** + your AI logic | The chat endpoint. Protect it with a Cognito authorizer. Behind it, put whatever you like: for example, a Lambda that calls a model on Amazon Bedrock. |

### Chat API contract

The app sends a `POST` to `EXPO_PUBLIC_API_ENDPOINT` with `Authorization: Bearer <Cognito ID token>`:

```json
{
  "input": "What's the weather like?",
  "conversationId": "uuid, reset when the chat is cleared",
  "imagePath": "https://<bucket>.s3.<region>.amazonaws.com/private/... (only for photos)",
  "context": {
    "location": { "latitude": 47.6062, "longitude": -122.3321, "name": "Seattle, WA" },
    "datetime": "2025-04-15T10:00:00.000Z",
    "preferences": {
      "temperatureUnit": "celsius",
      "generalUnits": "metric",
      "aiVoice": "Amy",
      "userName": "Anisha"
    }
  }
}
```

It expects a response like:

```json
{ "message": "The assistant's reply, which is shown in the chat and spoken by Polly" }
```

The backend should keep conversation history keyed by `conversationId`. To handle photos, it needs read access to the bucket so it can fetch `imagePath`.

## Getting started

Once your backend is deployed:

```sh
git clone https://github.com/anishamalde/ai-personal-assistant-frontend.git
cd ai-personal-assistant-frontend/frontend/amazon-intelligence
npm install
cp .env.example .env   # fill in your Cognito, S3, and API values
npm run ios            # or: npm run android / npm run web
```

The app uses an Expo [development build](https://docs.expo.dev/develop/development-builds/introduction/), so it won't run in Expo Go. See [frontend/amazon-intelligence/README.md](frontend/amazon-intelligence/README.md) for environment variables, EAS builds, and security notes.

## Build it step by step

The app was built one feature at a time, and every step has its own branch, so you can check out any point and see exactly what changed. `main` is the finished app.

### Talk walkthrough

These are the steps followed in the talk. Each one builds on the previous branch:

| Step | Branch | What it adds |
|---|---|---|
| 1 | [`frontend`](../../tree/frontend) | Fresh Expo app scaffold |
| 2 | [`add-navigation`](../../tree/add-navigation) | React Navigation: bottom tabs, screens, tab icons |
| 3 | [`add-amplify`](../../tree/add-amplify) | AWS Amplify config wired to environment variables |
| 4 | [`add-auth`](../../tree/add-auth) | Cognito sign in: `AuthContext` and the login screen |
| 5 | [`add-voice-recognition`](../../tree/add-voice-recognition) | Microphone, recording animation, speech to text |
| 6 | [`add-chat-interface`](../../tree/add-chat-interface) | Chat screen, message bubbles, permissions handling (branches off step 5 before its final tidy-up) |
| 7 | [`add-api-call`](../../tree/add-api-call) | Sending transcriptions to the chat API |
| 8 | [`add-preferences`](../../tree/add-preferences) | Profile preferences (units, voice) sent as context |
| 9 | [`add-polly`](../../tree/add-polly) | Spoken replies with Amazon Polly |

### Original development history

This is how the full app was first built, ending in `main`:

| Branch | What it adds |
|---|---|
| [`camera-functionality`](../../tree/camera-functionality) | Camera screen with `expo-camera` |
| [`improve-ui`](../../tree/improve-ui) | Microphone component, `ChatContext`, theme |
| [`add-mic-functionality-expo-av`](../../tree/add-mic-functionality-expo-av) | Audio recording with `expo-av` |
| [`add-mic-functionality-expo-stt`](../../tree/add-mic-functionality-expo-stt) | Speech to text with `expo-speech-recognition` |
| [`create-chat-functionality`](../../tree/create-chat-functionality) | Basic chat |
| [`add-authentication-cognito`](../../tree/add-authentication-cognito) | Cognito auth and a profile page with logout |
| [`add-chat-api`](../../tree/add-chat-api) | Chat API, location context, in-chat mic |
| [`store-image`](../../tree/store-image) | Photo upload to S3, plus preferences |
| [`fix-typescript`](../../tree/fix-typescript) | Voice playback, TypeScript fixes, docs |
| [`create-ui`](../../tree/create-ui) | EAS config, image compression, web fixes. This became `main`. |

## Credits

Based on [gunnargrosch/ai-personal-assistant-device](https://github.com/gunnargrosch/ai-personal-assistant-device) by Gunnar Grosch, under the [MIT licence](LICENSE). Icons are from [lucide.dev](https://lucide.dev/).
