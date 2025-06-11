
Here's how to use the API: 

This is how to use a local image
```python
from together import Together
import base64

client = Together()

getDescriptionPrompt = "what is in the image"

imagePath= "/home/Desktop/dog.jpeg"

def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

base64_image = encode_image(imagePath)

stream = client.chat.completions.create(
    model="meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": getDescriptionPrompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}",
                    },
                },
            ],
        }
    ],
    stream=True,
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "" if chunk.choices else "", end="", flush=True)
```

React example (what we want to use) 

```javascript
import Together from "together-ai";

const together = new Together();

let getDescriptionPrompt = `You are a UX/UI designer. Describe the attached screenshot or UI mockup in detail. I will feed in the output you give me to a coding model that will attempt to recreate this mockup, so please think step by step and describe the UI in detail.

- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to mention every part of the screenshot including any headers, footers, etc.
- Use the exact text from the screenshot.
`;
let imageUrl =
  "https://napkinsdev.s3.us-east-1.amazonaws.com/next-s3-uploads/d96a3145-472d-423a-8b79-bca3ad7978dd/trello-board.png";

async function main() {
  const stream = await together.chat.completions.create({
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    temperature: 0.2,
    stream: true,
    max_tokens: 500,
    messages: [
      {
        role: "user",
        // @ts-expect-error Need to fix the TypeScript library type
        content: [
          { type: "text", text: getDescriptionPrompt },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
```
