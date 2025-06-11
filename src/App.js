import React, { useState } from 'react';
import './App.css';
import Together from 'together-ai';
import ImagePicker from './components/ImagePicker';
import './components/ImagePicker.css';

function App() {
  const [prompt, setPrompt] = useState(`You are a helpful assistant. Describe the attached image in detail.`);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_TOGETHER_API_KEY || '');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageSource, setImageSource] = useState('url'); // 'url', 'upload', or 'local'

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const queryQwen = async () => {
    if (!apiKey) {
      alert('Please enter your Together AI API key');
      return;
    }

    if (!imageUrl && !imageFile) {
      alert('Please provide an image URL or upload an image');
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const together = new Together({ apiKey });

      const messages = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ];

      const stream = await together.chat.completions.create({
        model: "Qwen/Qwen2.5-VL-72B-Instruct", 
        messages: messages,
        temperature: 0.2,
        stream: true,
        max_tokens: 1000,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        setResponse(fullResponse);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Qwen 2.5 VL UI</h1>
        
        {!process.env.REACT_APP_TOGETHER_API_KEY && (
          <div className="api-key-section">
            <label>Together AI API Key:</label>
            <input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        )}

        <div className="input-section">
          <div className="prompt-section">
            <label>Prompt:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              placeholder="Enter your prompt here..."
            />
          </div>

          <div className="image-section">
            <label>Image Input:</label>
            <div className="image-input-toggle">
              <label>
                <input
                  type="radio"
                  name="imageSource"
                  checked={imageSource === 'url'}
                  onChange={() => setImageSource('url')}
                />
                URL
              </label>
              <label>
                <input
                  type="radio"
                  name="imageSource"
                  checked={imageSource === 'upload'}
                  onChange={() => setImageSource('upload')}
                />
                Upload
              </label>
              <label>
                <input
                  type="radio"
                  name="imageSource"
                  checked={imageSource === 'local'}
                  onChange={() => setImageSource('local')}
                />
                Local Directory
              </label>
            </div>

            {imageSource === 'url' && (
              <input
                type="text"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            )}
            
            {imageSource === 'upload' && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            )}
            
            {imageSource === 'local' && (
              <ImagePicker onImageSelect={(url) => setImageUrl(url)} />
            )}

            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Preview" />
              </div>
            )}
          </div>

          <button 
            onClick={queryQwen} 
            disabled={isLoading}
            className="query-button"
          >
            {isLoading ? 'Processing...' : 'Query Qwen 2.5 VL'}
          </button>
        </div>

        <div className="response-section">
          <h2>Response:</h2>
          <div className="response-content">
            {response || 'Response will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;