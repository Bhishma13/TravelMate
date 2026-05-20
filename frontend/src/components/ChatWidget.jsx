import { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';


function getSessionId() {
  const userId = localStorage.getItem('userId');
  if (userId) return `user-${userId}`;

  let anonId = sessionStorage.getItem('tm_anon_session');
  if (!anonId) {
    anonId = `anon-${crypto.randomUUID()}`;
    sessionStorage.setItem('tm_anon_session', anonId);
  }
  return anonId;
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! 👋 I\'m TravelMate AI. Ask me about policies, finding guides, open trips to join, or how the platform works!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setIsLoading(true);

    try {
      const sessionId = getSessionId();
      const response = await fetch(`${API_BASE}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.answer || 'Sorry, I could not process that.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I\'m having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'What is the cancellation policy?',
    'Find guides in Goa',
    'Open trips to Manali'
  ];

  
  function renderBotMessage(text) {
    const isLoggedIn = !!localStorage.getItem('userId');
    
    const parts = text.split(/(\/(post|guide)\/\d+)/g);
    const elements = [];
    let i = 0;

    while (i < parts.length) {
      const part = parts[i];

      if (/^\/post\/\d+$/.test(part)) {
        const href = isLoggedIn ? part : `/signin?redirect=${encodeURIComponent(part)}`;
        elements.push(
          <a key={i} href={href} className="chat-trip-link">
            View Trip &amp; Connect →
          </a>
        );
        i++;
      } else if (/^\/guide\/\d+$/.test(part)) {
        const href = isLoggedIn ? part : `/signin?redirect=${encodeURIComponent(part)}`;
        elements.push(
          <a key={i} href={href} className="chat-trip-link">
            View Guide Profile →
          </a>
        );
        i++;
      } else if (part === 'post' || part === 'guide') {
        
        i++;
      } else if (part) {
        elements.push(<span key={i}>{part}</span>);
        i++;
      } else {
        i++;
      }
    }
    return elements;
  }

  return (
    <div className="chat-widget">
      {}
      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-dot"></div>
              <div>
                <div className="chat-header-title">TravelMate AI</div>
                <div className="chat-header-subtitle">Powered by Gemini · Agentic AI</div>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                {msg.role === 'bot' && <span className="msg-icon">🤖</span>}
                <div className={`message-bubble ${msg.role}`}>
                  {msg.role === 'bot' ? renderBotMessage(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <span className="msg-icon">🤖</span>
                <div className="message-bubble bot">
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {}
          {messages.length <= 1 && (
            <div className="quick-questions">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="quick-chip"
                  onClick={() => { setInput(q); }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question..."
              disabled={isLoading}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {}
      {!isOpen && (
        <button className="chat-banner" onClick={() => setIsOpen(true)}>
          <span className="chat-banner-icon">✨</span>
          <span className="chat-banner-text">Ask anything about TravelMate</span>
        </button>
      )}
    </div>
  );
}

export default ChatWidget;
