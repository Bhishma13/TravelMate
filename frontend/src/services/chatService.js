import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (userId, onMessageReceived, onError) => {
    
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';
    const socket = new SockJS(`${backendUrl}/ws`);
    stompClient = Stomp.over(socket);

    
    stompClient.debug = () => { };

    
    stompClient.connect({}, (frame) => {
        

        
        const privateChannel = `/user/${userId}/queue/messages`;

        stompClient.subscribe(privateChannel, (message) => {
            if (message.body) {
                const parsedMessage = JSON.parse(message.body);
                onMessageReceived(parsedMessage);
            }
        });
    }, (error) => {
        console.error("STOMP Error:", error);
        if (onError) onError(error);
    });
};

export const sendMessage = (messageData) => {
    if (stompClient && stompClient.connected) {
        
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(messageData));
    } else {
        console.error("Cannot send Message: STOMP Client is not connected!");
    }
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        stompClient.disconnect();
        stompClient = null;
    }
};
