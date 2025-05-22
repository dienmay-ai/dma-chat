# DMA Chat Widget

A lightweight, customizable chat widget that can be easily embedded into any website. Built with Web Components for maximum compatibility and style isolation.

## Features

- 🎨 Customizable theme and appearance
- 💾 Local chat history persistence
- 🔌 Simple webhook integration
- 🎯 Zero dependencies
- 🛡️ Style isolation via Shadow DOM
- 📱 Responsive design
- ⌨️ Keyboard accessible
- 🔄 Message status indicators
- ❌ Request cancellation support
- 🔒 Secure by default
- 🌐 Cross-browser compatible
- 🚀 Small bundle size (~4KB gzipped)

## Installation

### Via CDN (Recommended)

```html
<script src="https://cdn.jsdelivr.net/npm/dma-chat-widget@latest/dist/dma-chat-widget.umd.js"
        data-webhook-url="https://your-backend.com/chat"
        data-theme-color="#1E40AF"
        data-position="bottom-right"
        data-title="Chat với chúng tôi"
        data-welcome-message="Chào bạn! Chúng tôi có thể giúp gì cho bạn?"
        data-history-enabled="true"
        data-history-clear-button="true"
        data-logo="https://your-domain.com/path/to/logo.png"
        defer>
</script>
```

### Via NPM

```bash
# Using npm
npm install dma-chat-widget

# Using pnpm
pnpm add dma-chat-widget

# Using yarn
yarn add dma-chat-widget
```

```javascript
import { initChatPopup } from 'dma-chat-widget';

initChatPopup({
  webhookUrl: 'https://your-backend.com/chat',
  themeColor: '#1E40AF',
  position: 'bottom-right',
  title: 'Chat với chúng tôi',
  welcomeMessage: 'Chào bạn! Chúng tôi có thể giúp gì cho bạn?',
  history: {
    enabled: true,
    clearButton: true
  }
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| webhookUrl | string | - | (Required) Backend endpoint URL for processing messages |
| themeColor | string | '#1E40AF' | Primary color for UI elements |
| position | 'bottom-right' \| 'bottom-left' | 'bottom-right' | Widget position on screen |
| title | string | 'Chat with us' | Chat window title |
| welcomeMessage | string | '' | Initial message shown when chat opens |
| history.enabled | boolean | true | Enable/disable chat history persistence |
| history.clearButton | boolean | true | Show/hide the clear history button |
| logo | string | '' | URL to custom logo image |
*Note for Logo:
- Supported formats: PNG/JPEG/SVG
- Recommended size: 80x80px
- Logo URL must be an absolute path
- The widget will automatically adjust the logo size to fit

## Features in Detail

### Message Status Indicators

Messages show their current status:
- 🔄 Sending: Message is being sent to the webhook
- ✅ Sent: Message was successfully delivered
- ❌ Error: Failed to send message
- ⚪ Cancelled: User cancelled the message

### History Management

Chat history is stored in LocalStorage:
- Persists across page reloads
- Separate storage per webhook URL
- Optional clear history button
- Automatic loading of previous messages

### Webhook Integration

The widget sends POST requests to your webhook URL with the following JSON payload:

```typescript
{
  message: string;          // User's message
  timestamp: string;        // ISO8601 timestamp
  sessionId: string;        // Unique session identifier
  context: {
    url: string;           // Current page URL
  };
  history?: Array<{        // Last 10 messages (if any)
    id: string;
    text: string;
    sender: 'user' | 'backend' | 'system';
    timestamp: string;
  }>;
}
```

Expected response format:

```typescript
{
  response: string;        // Text message to display to the user
}
```

### Security Features

- Content Security Policy (CSP) compatible
- No eval() or inline scripts
- XSS protection for message rendering
- CORS support for webhook requests
- Secure by default configuration

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Accessibility

- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast support

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. Clone the repository
```bash
git clone https://github.com/dienmay-ai/dma-chat.git
cd dma-chat
```

2. Install dependencies
```bash
pnpm install
```

3. Start development server
```bash
pnpm dev
```

4. Build for production
```bash
pnpm build
```

### Testing the Widget

1. Start the mock server
```bash
pnpm start
```

2. Open http://localhost:3000 in your browser
3. Try the demo features:
   - Send messages
   - Cancel messages
   - Clear history
   - Change theme color
   - Test responsiveness

### Project Structure

```
just-chat/
├── src/
│   ├── components/        # Web Components
│   │   ├── base-component.ts
│   │   ├── chat-widget.ts
│   │   ├── chat-launcher.ts
│   │   └── chat-window.ts
│   ├── services/         # Core services
│   │   ├── storage.ts
│   │   └── webhook.ts
│   └── main.ts          # Entry point
├── dist/                # Built files
├── mock-server.js      # Test server
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

- GitHub Issues: [Report a bug](https://github.com/draphonix/just-chat/issues)
- Email: hoang@kieng.io.vn

## Credits

Built with:
- TypeScript
- Web Components
- Vite
- Express (mock server)# just-chat


| Thuộc tính | Bắt buộc | Mặc định | Mô tả |
|------------|----------|----------|-------|
| data-webhook-url | Có | - | URL endpoint backend để xử lý tin nhắn |
| data-theme-color | Không | '#1E40AF' | Màu chủ đạo cho giao diện |
| data-position | Không | 'bottom-right' | Vị trí widget ('bottom-right' hoặc 'bottom-left') |
| data-title | Không | 'Chat with us' | Tiêu đề cửa sổ chat |
| data-welcome-message | Không | '' | Tin nhắn chào mừng khi mở chat |
| data-history-enabled | Không | 'true' | Bật/tắt lưu lịch sử chat |
| data-history-clear-button | Không | 'true' | Hiển thị nút xóa lịch sử |
| data-logo | Không | '' | URL logo tùy chỉnh |
