import React, { useState, useEffect, useRef } from 'react';
import { connectWebSocket, disconnectWebSocket, sendMessage } from '../services/chatService';
import { getChatHistory } from '../services/api';

function ChatBox({ bookingRequestId, currentUserId, otherUserId, otherUserName, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // 1. Fetch History
        getChatHistory(bookingRequestId, currentUserId)
            .then(history => {
                setMessages(history);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load chat history", err);
                setIsLoading(false);
            });

        // 2. Connect to WebSockets for live messages
        connectWebSocket(
            currentUserId,
            (incomingMessage) => {
                // When a live message arrives, append it to the chat!
                setMessages(prevMessages => [...prevMessages, incomingMessage]);
            },
            (error) => {
                console.error("Chat WebSocket Error: ", error);
            }
        );

        // 3. Cleanup: disconnect when the user closes the chat window
        return () => {
            disconnectWebSocket();
        };
    }, [bookingRequestId, currentUserId]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            bookingRequestId: bookingRequestId,
            senderId: currentUserId,
            receiverId: otherUserId,
            content: newMessage.trim(),
            timestamp: new Date().toISOString()
        };

        // Send down the WebSocket tunnel
        sendMessage(messageData);

        // Optimistically add it to our own screen instantly
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
    };

    return (
        <div style={{
            position: 'fixed', bottom: '20px', right: '20px', width: '360px', height: '520px',
            background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)', zIndex: 1000, overflow: 'hidden',
            backdropFilter: 'blur(10px)'
        }}>
            {/* Chat Header */}
            <div style={{
                padding: '1rem', background: 'var(--primary-color)', color: '#000',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Simple Avatar Placeholder */}
                    <div style={{
                        width: '35px', height: '35px', borderRadius: '50%',
                        background: '#000', color: 'var(--primary-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '1.2rem'
                    }}>
                        {otherUserName ? otherUserName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{otherUserName}</span>
                </div>
                <button onClick={onClose} style={{
                    background: 'rgba(0,0,0,0.1)', border: 'none', color: '#000',
                    fontSize: '1rem', cursor: 'pointer', width: '30px', height: '30px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s'
                }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.2)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.1)'}
                >✖</button>
            </div>

            {/* Chat Messages Log */}
            <div style={{
                flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', color: '#aaa' }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#aaa', margin: 'auto' }}>Say hi to {otherUserName}!</div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={index} style={{
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                background: isMe ? 'var(--primary-color)' : 'rgba(255,255,255,0.15)',
                                color: isMe ? '#000' : '#fff',
                                padding: '10px 14px',
                                borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                maxWidth: '75%',
                                wordBreak: 'break-word', fontSize: '0.95rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                                {msg.content}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} style={{
                padding: '12px', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '10px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    autoFocus
                    style={{
                        flex: 1, padding: '10px 15px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)',
                        outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff',
                        fontSize: '0.95rem'
                    }}
                />
                <button type="submit" disabled={!newMessage.trim()} style={{
                    background: newMessage.trim() ? 'var(--primary-color)' : 'rgba(255,179,0,0.5)',
                    color: '#000', border: 'none',
                    borderRadius: '50%', width: '42px', height: '42px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'default', padding: 0,
                    transition: 'all 0.2s', transform: newMessage.trim() ? 'scale(1)' : 'scale(0.95)'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                    </svg>
                </button>
            </form>
        </div>
    );
}

export default ChatBox;
