专用图片生成（gemini-imagen）

使用 gemini-imagen 虚拟模型强制启用图片生成功能，输出格式由系统设置决定（base64 或 url）。

```
curl -X POST "http://localhost:7860/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gemini-imagen",
    "stream": true,
    "messages": [
      { "role": "user", "content": "生成一只可爱的猫咪，卡通风格" }
    ]
  }'
```

专用视频生成（gemini-veo）

使用 gemini-veo 虚拟模型生成视频，输出格式由系统设置决定（html/url/markdown）。

```
curl -X POST "http://localhost:7860/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gemini-veo",
    "stream": true,
    "messages": [
      { "role": "user", "content": "生成一段可爱猫咪玩耍的视频" }
    ]
  }'
```

图生图格式（Base64 / URL 输入）

content 使用多模态数组，image_url 可填 URL 或 data:base64。

```
curl -X POST "http://localhost:7860/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gemini-3-flash-preview",
    "stream": false,
    "temperature": 0.7,
    "top_p": 1,
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": "把图片改成插画风格" },
          { "type": "image_url", "image_url": { "url": "https://example.com/cat.png" } }
        ]
      }
    ]
  }'
curl -X POST "http://localhost:7860/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gemini-3-flash-preview",
    "stream": false,
    "temperature": 0.7,
    "top_p": 1,
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": "增强画面细节" },
          { "type": "image_url", "image_url": { "url": "data:image/png;base64,AAA..." } }
        ]
      }
    ]
  }'
```