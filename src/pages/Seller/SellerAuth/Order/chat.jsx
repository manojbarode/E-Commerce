import React, { useState, useRef, useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 How can I help you today?" }
  ]);
  const [message, setMessage] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Server not responding" },
      ]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>eShop AI Support</div>

      <div style={styles.body}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              ...(m.sender === "user" ? styles.user : styles.bot),
            }}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={styles.footer}>
        <input
          style={styles.input}
          value={message}
          placeholder="Type your message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 420,
    height: "90vh",
    margin: "20px auto",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    fontFamily: "Arial",
  },
  header: {
    background: "#0d6efd",
    color: "#fff",
    padding: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
    background: "#f1f3f6",
  },
  message: {
    padding: "8px 12px",
    marginBottom: 10,
    maxWidth: "75%",
    borderRadius: 10,
  },
  user: {
    background: "#0d6efd",
    color: "#fff",
    marginLeft: "auto",
  },
  bot: {
    background: "#fff",
  },
  footer: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: 6,
    padding: "8px 14px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },
};

export default Chat;
