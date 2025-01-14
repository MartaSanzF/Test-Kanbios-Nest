import { useEffect, useState, useRef } from "react";
import openSocket from "socket.io-client";
import { jwtDecode } from "jwt-decode";

import Message from "./Message";
import MessageInput from './MessageInput';

const socket = openSocket("http://localhost:3000", {
    transports: ["websocket"],
});

function Messages() {

    const [isFetching, setIsFetching] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    const sendMessage = async (message) => {
        try {

            // POST message
            const response = await fetch("http://localhost:3000/messages/createMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    content: message,
                }),
            });

            const data = await response.json();

            // check error response (400 or 500)
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            // Add message to state
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: data._id,
                    content: data.content,
                    senderName: data.senderName,
                    senderId: data.senderId,
                    status: data.status,
                    createdAt: new Date(data.createdAt).toLocaleString(),
                },
            ]);

            scrollToBottom();

        } catch (err) {

            setError(err.message);
        }

    }

    useEffect(() => {
        const fetchMessages = async () => {

            try {

                // loading
                setIsFetching(true);

                // GET messages
                const response = await fetch("http://localhost:3000/messages/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                const data = await response.json();

                // check error response (400 or 500)
                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong!");
                }

                // Transform dates
                const formattedMessages = data.map((message) => ({
                    ...message,
                    createdAt: new Date(message.createdAt).toLocaleString(),
                }));

                setMessages(formattedMessages);

            } catch (err) {

                setError(err.message);
            }

            setIsFetching(false);
            scrollToBottom();
        };

        fetchMessages();

        // Listen for new messages
        socket.on("messages", (data) => {

            const token = localStorage.getItem("token");

            const userId = jwtDecode(token).userId;

            if (data.action === "create" && data.message.senderId != userId) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        _id: data.message._id,
                        content: data.message.content,
                        senderName: data.message.senderName,
                        senderId: data.message.senderId,
                        status: data.message.status,
                        createdAt: new Date(data.message.createdAt).toLocaleString(),
                    },
                ]);

                scrollToBottom();
            }
        });

        return () => {
            socket.off("messages");
        }

    }, []);

    useEffect(() => {
        // Scroll to bottom when new message is added
        scrollToBottom();
    }, [messages]);

    // Is error 
    if (error) {
        return <p data-testid="error" className="text-center mt-32">{error}</p>;
    }

    // Is fetching
    if (isFetching) {
        return <p className="text-center mt-32">Loading...</p>;
    }

    return (
        <div className="h-full py-28 overflow-y-auto">
            {messages.length === 0 ? (
                <p className="text-center mt-6">No messages yet</p>
            ) : (
                messages.map((message) => (
                    <Message
                        key={message._id}
                        senderName={message.senderName}
                        senderId={message.senderId}
                        date={message.createdAt}
                        content={message.content}
                        status={message.status}
                    />
                ))
            )}
           <div ref={messagesEndRef} />
           <MessageInput onSendMessage={sendMessage} />
        </div>

    );
}

export default Messages;