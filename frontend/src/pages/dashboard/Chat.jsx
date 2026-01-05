import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner"; // 🔔 notification import

function Chat() {
  const { matchId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:2000");

    socketRef.current.emit("joinRoom", matchId);

    socketRef.current.on("receiveMessage", msg => {
      setMessages(prev => [...prev, msg]);

      // 🔔 ALWAYS show notification for incoming message
      toast("New message received");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [matchId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId: matchId,
      text: message,
      sender: "me",
    };

    // show message instantly in UI
    setMessages(prev => [...prev, msgData]);

    socketRef.current.emit("sendMessage", msgData);

    setMessage("");
  };

  return (
    <div>
      <h2>Chat</h2>

      <div
        style={{
          border: "1px solid gray",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.length === 0 && <p>No messages yet</p>}

        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.sender || "User"}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage} style={{ marginLeft: "8px" }}>
        Send
      </button>
    </div>
  );
}

export default Chat;

