import { BaseComponent } from './base-component';
import { StorageService, ChatMessage } from '../services/storage';
import { WebhookService } from '../services/webhook';

export class ChatWindow extends BaseComponent {
  static get observedAttributes() {
    return ['webhook-url', 'title', 'welcome-message', 'history-enabled', 'history-clear-button', 'position'];
  }

  private styles = `
    .chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 420px;  // Đổi từ 320px -> 420px
      height: 650px; // Đổi từ 480px -> 650px
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
    }

    .chat-window.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    :host([position="bottom-left"]) .chat-window {
      right: auto;
      left: 0;
    }

    .header {
      padding: 16px;
      background-color: var(--theme-color, #1E40AF);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .header button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .header button:hover {
      opacity: 1;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .message {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
    }

    .message.user {
      align-self: flex-end;
      background-color: var(--theme-color, #1E40AF);
      color: white;
    }

    .message.backend {
      align-self: flex-start;
      background-color: #f0f0f0;
      color: #333;
    }

    .message.system {
      align-self: center;
      background-color: #f5f5f5;
      color: #666;
      font-style: italic;
      font-size: 13px;
    }

    .message.error {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .message-status {
      font-size: 11px;
      margin-top: 4px;
      opacity: 0.8;
    }

    .cancel-button {
      font-size: 12px;
      padding: 2px 6px;
      background: rgba(0, 0, 0, 0.1);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 8px;
    }

    .input-area {
      padding: 16px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 8px;
    }

    .input-area input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 20px;
      font-size: 14px;
    }

    .input-area button {
      background-color: var(--theme-color, #1E40AF);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      transition: opacity 0.2s;
    }

    .input-area button:hover {
      opacity: 0.9;
    }

    .input-area button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  
  .footer {
    padding: 8px 16px;
    background-color: #f5f5f5;
    border-top: 1px solid #eee;
    font-size: 11px;
    color: #666;
    text-align: center;
  }
  
  .header-logo {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>');
    background-repeat: no-repeat;
    background-size: contain;
  }
  
  .header-title {
    display: flex;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    .chat-window {
      width: 100vw;
      height: 100vh;
      max-height: -webkit-fill-available;
      bottom: 0;
      right: 0;
      border-radius: 0;
    }
    
    :host([position="bottom-left"]) .chat-window {
      left: 0;
      right: auto;
    }
    
    .messages {
      padding-bottom: 80px;
    }
    
    .input-area {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      padding: 12px 16px;
    }
  }
`;

  private isOpen = false;
  private storage: StorageService;
  private webhook: WebhookService;
  private sessionId: string;
  private hasShownWelcomeMessage = false;

  constructor() {
    super();
    const webhookUrl = this.getAttribute('webhook-url') || '';
    this.storage = new StorageService(webhookUrl);
    this.webhook = new WebhookService(webhookUrl);
    this.sessionId = crypto.randomUUID();
    this.addStyles(this.styles);
    this.render();
  }

  protected render(): void {
    const window = this.createElement('div', 'chat-window');
    
    // Header
    const header = this.createElement('div', 'header');
    
    // Tạo container cho logo và title
    const titleContainer = this.createElement('div', 'header-title');
    const logo = this.createElement('div', 'header-logo');
    const title = this.createElement('h2', '', this.getAttribute('title') || 'Chat with us');
    
    titleContainer.appendChild(logo);
    titleContainer.appendChild(title);
    
    const headerActions = this.createElement('div', 'header-actions');
    
    if (this.getAttribute('history-enabled') !== 'false' && 
        this.getAttribute('history-clear-button') !== 'false') {
      const clearBtn = this.createElement('button', '', '🗑️');
      clearBtn.title = 'Clear history';
      clearBtn.addEventListener('click', () => this.clearHistory());
      headerActions.appendChild(clearBtn);
    }
    
    const closeBtn = this.createElement('button', '', '✕');
    closeBtn.addEventListener('click', () => this.close());
    headerActions.appendChild(closeBtn);
    
    header.appendChild(titleContainer);
    header.appendChild(headerActions);
    
    // Messages area
    const messages = this.createElement('div', 'messages');
    
    // Load existing messages
    if (this.getAttribute('history-enabled') !== 'false') {
      const existingMessages = this.storage.getMessages();
      existingMessages.forEach(msg => this.renderMessage(msg, messages));
    }
    
    // Input area
    const inputArea = this.createElement('div', 'input-area');
    const input = this.createElement('input') as HTMLInputElement;
    input.type = 'text';
    input.placeholder = 'Type your message...';
    
    const sendBtn = this.createElement('button', '', 'Send');
    const handleSend = () => {
      const text = input.value.trim();
      if (text) {
        this.sendMessage(text);
        input.value = '';
      }
    };
    
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    
    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);
    
    // Thêm footer
    const footer = this.createElement('div', 'footer');
    footer.textContent = 'Chatbot AI powered by DMA';
    
    window.appendChild(header);
    window.appendChild(messages);
    window.appendChild(inputArea);
    window.appendChild(footer); // Thêm footer vào cuối
    
    this.shadow.innerHTML = '';
    this.shadow.appendChild(window);

    // Show welcome message only if it hasn't been shown yet and the chat is being opened
    const welcomeMessage = this.getAttribute('welcome-message');
    if (welcomeMessage && !this.hasShownWelcomeMessage && this.isOpen) {
      this.addSystemMessage(welcomeMessage);
      this.hasShownWelcomeMessage = true;
    }
  }

  private async sendMessage(text: string) {
    const messageId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const message: ChatMessage = {
      id: messageId,
      text,
      sender: 'user',
      timestamp,
      status: 'sending'
    };

    // Add message to UI and storage
    this.storage.addMessage(message);
    this.renderMessage(message);

    try {
      // Send to webhook
      const response = await this.webhook.sendMessage({
        message: text,
        timestamp,
        sessionId: this.sessionId,
        context: {
          url: window.location.href
        },
        history: this.storage.getMessages().slice(-10) // Send last 10 messages
      });

      // Update message status
      message.status = 'sent';
      this.storage.updateMessage(messageId, { status: 'sent' });
      this.updateMessageStatus(messageId, 'sent');

      // Add response message
      const responseMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: response.response,
        sender: 'backend',
        timestamp: new Date().toISOString()
      };
      
      this.storage.addMessage(responseMessage);
      this.renderMessage(responseMessage);

    } catch (error) {
      if (error instanceof Error && error.message === 'Request cancelled') {
        message.status = 'cancelled';
        this.storage.updateMessage(messageId, { status: 'cancelled' });
        this.updateMessageStatus(messageId, 'cancelled');
      } else {
        message.status = 'error';
        this.storage.updateMessage(messageId, { status: 'error' });
        this.updateMessageStatus(messageId, 'error');
        this.addSystemMessage('Failed to send message. Please try again.');
      }
    }
  }

  private renderMessage(message: ChatMessage, container?: HTMLElement) {
    const messages = container || this.shadow.querySelector('.messages');
    if (!messages) return;

    const messageEl = this.createElement('div', `message ${message.sender}`);
    messageEl.textContent = message.text;
    messageEl.dataset.messageId = message.id;

    if (message.sender === 'user' && message.status) {
      const statusEl = this.createElement('div', 'message-status');
      statusEl.textContent = message.status;
      
      if (message.status === 'sending') {
        const cancelBtn = this.createElement('button', 'cancel-button', 'Cancel');
        cancelBtn.addEventListener('click', () => {
          this.webhook.cancelRequest();
        });
        statusEl.appendChild(cancelBtn);
      }
      
      messageEl.appendChild(statusEl);
    }

    messages.appendChild(messageEl);
    messages.scrollTop = messages.scrollHeight;
  }

  private updateMessageStatus(messageId: string, status: string) {
    const messageEl = this.shadow.querySelector(`[data-message-id="${messageId}"]`);
    if (messageEl) {
      const statusEl = messageEl.querySelector('.message-status');
      if (statusEl) {
        statusEl.textContent = status;
      }
    }
  }

  private clearHistory() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.storage.clearHistory();
      const messages = this.shadow.querySelector('.messages');
      if (messages) {
        messages.innerHTML = '';
      }
      // Reset welcome message flag when history is cleared
      this.hasShownWelcomeMessage = false;
    }
  }

  private addSystemMessage(text: string) {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      sender: 'system',
      timestamp: new Date().toISOString()
    };
    
    if (this.getAttribute('history-enabled') !== 'false') {
      this.storage.addMessage(message);
    }
    
    this.renderMessage(message);
  }

  private close() {
    this.isOpen = false;
    this.updateVisibility();
    this.dispatchEvent(new CustomEvent('close'));
  }

  public setOpen(open: boolean) {
    this.isOpen = open;
    this.updateVisibility();
    
    // If opening the chat and no messages exist, show welcome message
    if (open && !this.hasShownWelcomeMessage) {
      const welcomeMessage = this.getAttribute('welcome-message');
      if (welcomeMessage) {
        this.addSystemMessage(welcomeMessage);
        this.hasShownWelcomeMessage = true;
      }
    }
  }

  private updateVisibility() {
    const window = this.shadow.querySelector('.chat-window');
    if (window) {
      if (this.isOpen) {
        window.classList.add('open');
      } else {
        window.classList.remove('open');
      }
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === 'webhook-url') {
        const webhookUrl = newValue || '';
        this.storage = new StorageService(webhookUrl);
        this.webhook = new WebhookService(webhookUrl);
      }
      // Re-render to update all attributes
      this.render();
    }
  }
}

customElements.define('chat-window', ChatWindow);