import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (userId, onMessageReceived, onError) => {
    // 1. Establish the SockJS connection to the Spring Boot endpoint
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);

    // Disable debug logging in console for cleaner output, but can be enabled for troubleshooting
    stompClient.debug = () => { };

    // 2. Connect
    stompClient.connect({}, (frame) => {
        // console.log('Connected: ' + frame);

        // 3. Subscribe to the user's specific private inbox queue
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
        // Send to the MessageMapping endpoint defined in ChatController.java
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
