import React, { useState, useEffect, useRef } from "react";
import api from "../api/axiosConfig";

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const chatEndRef = useRef(null);

  const samplePrompts = [
    "Where did I spend the most this month?",
    "How much did I spend this month?",
    "Which category has the highest spending?",
    "Show me my biggest expenses."
  ];

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: "ai",
        text:
          "Hello! I am your FinSight AI financial assistant, powered by Google Gemini. " +
          "I can analyze the financial records stored in your FinSight account. " +
          "Ask me about your expenses, spending categories, or saving habits."
      }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const message = textToSend?.trim();

    if (!message || isTyping) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setErrorMessage("");

    try {
      /*
       * axiosConfig should automatically attach:
       *
       * Authorization: Bearer <JWT>
       *
       * The backend endpoint is:
       *
       * POST /api/ai/chat
       */

      const response = await api.post("/ai/chat", {
        message: message
      });

      if (
        response?.data?.success === true &&
        response?.data?.reply
      ) {
        const aiMessage = {
          id: Date.now() + 1,
          sender: "ai",
          text: response.data.reply
        };

        setMessages((prev) => [...prev, aiMessage]);

      } else {

        const backendMessage =
          response?.data?.message ||
          "FinSight AI could not generate a response.";

        throw new Error(backendMessage);
      }

    } catch (error) {

      console.error(
        "FinSight AI request failed:",
        error
      );

      /*
       * Handle authentication errors separately.
       */

      if (error?.response?.status === 401) {

        setErrorMessage(
          "Your session has expired. Please log in again."
        );

      } else if (error?.response?.status === 403) {

        setErrorMessage(
          "You are not authorized to use FinSight AI."
        );

      } else {

        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to generate AI response.";

        setErrorMessage(
          `FinSight AI Error: ${serverMessage}`
        );
      }

    } finally {

      setIsTyping(false);
    }
  };

  return (
    <div
      className="container-fluid p-0 d-flex flex-column"
      style={{ height: "calc(100vh - 120px)" }}
    >

      {/* Header */}

      <div className="mb-3">

        <h2 className="fw-bold text-dark">
          FinSight AI Assistant
        </h2>

        <p className="text-muted mb-0">
          Ask questions about your financial records,
          expenses, spending patterns, and savings.
        </p>

      </div>

      {/* Error */}

      {errorMessage && (
        <div
          className="alert alert-danger rounded-3 small py-2 mb-2"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <div className="row g-3 flex-grow-1 overflow-hidden">

        {/* Chat */}

        <div className="col-12 col-lg-9 d-flex flex-column h-100">

          <div
            className="bg-white border border-light-subtle rounded-4 shadow-sm overflow-hidden d-flex flex-column h-100"
          >

            {/* Messages */}

            <div
              className="flex-grow-1 p-4 overflow-y-auto style-scroll-chat bg-light bg-opacity-25"
            >

              {messages.map((msg) => {

                const isAi = msg.sender === "ai";

                return (
                  <div
                    key={msg.id}
                    className={`d-flex mb-4 ${
                      isAi
                        ? "justify-content-start"
                        : "justify-content-end"
                    }`}
                  >

                    <div
                      className={`d-flex gap-2 ${
                        isAi
                          ? "flex-row"
                          : "flex-row-reverse"
                      }`}
                      style={{
                        maxWidth: "75%"
                      }}
                    >

                      {/* Avatar */}

                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                        style={{
                          width: "36px",
                          height: "36px",
                          backgroundColor: isAi
                            ? "#4f46e5"
                            : "#212529",
                          color: "#ffffff",
                          fontSize: "0.85rem"
                        }}
                      >
                        {isAi ? "🤖" : "👤"}
                      </div>

                      {/* Message */}

                      <div
                        className={`p-3 rounded-4 shadow-sm border ${
                          isAi
                            ? "bg-white text-dark border-light-subtle"
                            : "bg-primary text-white border-primary"
                        }`}
                        style={{
                          whiteSpace: "pre-line",
                          lineHeight: "1.5"
                        }}
                      >
                        {msg.text}
                      </div>

                    </div>

                  </div>
                );
              })}

              {/* Typing */}

              {isTyping && (

                <div className="d-flex justify-content-start mb-4">

                  <div className="d-flex gap-2 align-items-center">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white shadow-sm"
                      style={{
                        width: "36px",
                        height: "36px"
                      }}
                    >
                      🤖
                    </div>

                    <div
                      className="px-3 py-2 bg-white border border-light-subtle rounded-4 text-muted small shadow-sm"
                    >
                      <span
                        className="spinner-grow spinner-grow-sm me-2"
                        role="status"
                      ></span>

                      Analyzing your FinSight financial data...
                    </div>

                  </div>

                </div>
              )}

              <div ref={chatEndRef} />

            </div>

            {/* Input */}

            <div
              className="p-3 border-top border-light-subtle bg-white"
            >

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }}
                className="d-flex gap-2"
              >

                <input
                  type="text"
                  className="form-control rounded-3 py-2 border-light-subtle px-3"
                  placeholder="Ask about your expenses..."
                  value={inputMessage}
                  onChange={(e) =>
                    setInputMessage(e.target.value)
                  }
                  disabled={isTyping}
                />

                <button
                  type="submit"
                  className="btn btn-primary px-4 rounded-3 fw-semibold"
                  disabled={
                    isTyping ||
                    !inputMessage.trim()
                  }
                >
                  {isTyping ? "Analyzing..." : "Send"}
                </button>

              </form>

            </div>

          </div>

        </div>

        {/* Suggested Questions */}

        <div className="col-12 col-lg-3 d-none d-lg-block h-100">

          <div
            className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 overflow-y-auto"
          >

            <h6 className="fw-bold text-dark mb-2">
              Suggested Questions
            </h6>

            <p className="small text-muted mb-3">
              Ask FinSight AI questions about your
              recorded financial activity.
            </p>

            <div className="d-flex flex-column gap-2">

              {samplePrompts.map((prompt, index) => (

                <button
                  key={index}
                  type="button"
                  className="btn btn-light text-start border border-light-subtle rounded-3 small p-2 transition-all text-dark fw-medium"
                  onClick={() =>
                    handleSendMessage(prompt)
                  }
                  disabled={isTyping}
                  style={{
                    fontSize: "0.82rem"
                  }}
                >
                  💡 {prompt}
                </button>

              ))}

            </div>

          </div>

        </div>

      </div>

      <style>{`

        .style-scroll-chat::-webkit-scrollbar {
          width: 5px;
        }

        .style-scroll-chat::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 5px;
        }

        .transition-all {
          transition: all 0.2s ease;
        }

        .transition-all:hover {
          transform: translateY(-2px);
        }

      `}</style>

    </div>
  );
}