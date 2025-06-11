# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application that provides a web UI for interacting with the Qwen 2.5 Vision-Language model through the Together AI API. The app allows users to upload images (via URL, file upload, or local directory) and query the model with text prompts.

## Key Commands

```bash
# Start development server (http://localhost:3000)
npm start

# Build for production
npm build

# Run tests
npm test
```

## Architecture

### Technology Stack
- React 18.2.0 with functional components and hooks
- CRACO 7.1.0 for webpack configuration customization
- Together AI SDK 0.7.0 for API integration
- CSS for styling (no CSS-in-JS or UI framework)

### Important Configuration
- **craco.config.js**: Defines webpack alias `@images` pointing to `/images` directory
- **Environment variable**: `REACT_APP_TOGETHER_API_KEY` for API authentication

### Core Components
- **App.js**: Main component handling all state and API interactions
  - Manages image input (URL/file/local), API key, prompts, and responses
  - Implements streaming response handling from Together AI
- **ImagePicker.js**: Reusable component for local image selection from `/images` directory
  - Uses webpack's require.context for dynamic image loading

### API Integration Pattern
The app uses Together AI's JavaScript SDK with streaming responses:
```javascript
const stream = await client.chat.completions.create({
  model: "Qwen/QwQ-32B-Preview",
  messages: [/* ... */],
  stream: true,
});
```

### State Management
Uses React's useState hooks for all state management. No external state libraries are used. Key state includes:
- `prompt`: User's text input
- `imageUrl`/`imageFile`: Image data depending on input method
- `apiKey`: Together AI API key
- `response`: Model's response text
- `loading`: Loading state during API calls
- `imageSourceType`: Tracks which image input method is active

## Development Notes

- All React scripts are wrapped with CRACO for custom configuration
- Images in `/images` directory can be imported using the `@images` alias
- The app handles three image input methods: URL, file upload, and local directory selection
- Base64 encoding is used for uploaded images when sending to the API