import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const chatEndRef = useRef(null);

  const samplePrompts = [
    "Where did I spend the most this month?",
    "How can I save ₹10,000?",
    "Compare this month with last month.",
    "Am I overspending?"
  ];

  useEffect(() => {
    // Prime the conversation context loop matching user architecture specifications
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: "Hello! I am your FinSight AI financial assistant, powered by Google Gemini. I can help analyze your category spending, check budgets, evaluate goals, or offer educational investment insights. What financial matrices shall we inspect today?"
      }
    ]);
  }, []);

  useEffect(() => {
    // Keep conversation view anchored securely to latest message blocks
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setErrorMessage("");

    try {
      // Production Gemini API proxy interface payload model mapping context:
      // const res = await axios.post("http://localhost:8080/api/ai/chat", { prompt: textToSend }, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      // });
      // setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: res.data.response }]);

      // Mocking highly tailored response templates mirroring blueprint target behaviors
      setTimeout(() => {
        let aiResponseText = "I have scanned your financial configuration matrices. To construct explicit feedback pools, try tracking specific categories like Food or Travel inside your ledger framework panels.";
        
        const lowerText = textToSend.toLowerCase();
        if (lowerText.includes("spend") || lowerText.includes("most")) {
          aiResponseText = "Analyzing your cycle metrics: Your highest spending category is **Rent** (₹15,000), closely trailed by **Food** (₹9,200). Your Food consumption profile registers 20% higher than baseline allowances. Consider applying tight budgeting parameters to prevent capital structural leaks.";
        } else if (lowerText.includes("save") || lowerText.includes("10,000")) {
          aiResponseText = "To unlock a savings capacity of **₹10,000**, implement these two operational procedures:\n1. Limit your dining/restaurant outlays to reduce Food overheads by ₹2,200.\n2. Hold your variable Shopping allocations down to match structural rules. Reallocating this unused buffer into your *Emergency Runway Fund* node yields optimal safety results.";
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: aiResponseText
          }
        ]);
        setIsTyping(false);
      }, 1000);

    } catch (err) {
      setErrorMessage("Could not broadcast textual frame matrix to the Gemini execution cluster.");
      setIsTyping(false);
    }
  };

  return (
    <div className="container-fluid p-0 d-flex flex-column" style={{ height: "calc(100vh - 120px)" }}>
      <div className="mb-3">
        <h2 className="fw-bold text-dark">Gemini AI Workspace Assistant</h2>
        <p className="text-muted mb-0">Query natural language instructions to dissect spending habits and isolate pattern vectors.</p>
      </div>

      {errorMessage && <div className="alert alert-danger rounded-3 small py-2 mb-2">{errorMessage}</div>}

      <div className="row g-3 flex-grow-1 overflow-hidden">
        {/* Main Conversation Window Stream */}
        <div className="col-12 col-lg-9 d-flex flex-column h-100 bg-white border border-light-subtle rounded-4 shadow-sm overflow-hidden">
          <div className="flex-grow-1 p-4 overflow-y-auto style-scroll-chat bg-light bg-opacity-25">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={msg.id} className={`d-flex mb-4 ${isAi ? "justify-content-start" : "justify-content-end"}`}>
                  <div className={`d-flex gap-2.5 max-w-75 ${isAi ? "flex-row" : "flex-row-reverse"}`}>
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 font-monospace shadow-sm`}
                      style={{ 
                        width: "36px", 
                        height: "36px", 
                        backgroundColor: isAi ? "#4f46e5" : "#212529",
                        color: "#ffffff",
                        fontSize: "0.85rem"
                      }}
                    >
                      {isAi ? "🤖" : "👤"}
                    </div>
                    <div 
                      className={`p-3 rounded-4 shadow-sm border ${
                        isAi 
                          ? "bg-white text-dark border-light-subtle" 
                          : "bg-primary text-white border-primary"
                      }`}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="d-flex justify-content-start mb-4">
                <div className="d-flex gap-2.5 align-items-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white font-monospace text-xs shadow-sm" style={{ width: "36px", height: "36px" }}>🤖</div>
                  <div className="px-3 py-2 bg-white border border-light-subtle rounded-4 text-muted small shadow-sm">
                    <span className="spinner-grow spinner-grow-sm me-1 bg-secondary" role="status"></span>
                    Evaluating pipeline telemetry metrics...
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Dispatcher Console Dock */}
          <div className="p-3 border-top border-light-subtle bg-white">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="d-flex gap-2"
            >
              <input
                type="text"
                className="form-control rounded-3 py-2.5 border-light-subtle px-3"
                placeholder="Ask Gemini: 'Am I overspending on my Food budget envelope?'..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" className="btn btn-primary px-4 rounded-3 fw-semibold" disabled={isTyping || !inputMessage.trim()}>
                Transmit
              </button>
            </form>
          </div>
        </div>

        {/* Suggested Context Triggers Sidebar Column */}
        <div className="col-12 col-lg-3 d-none d-lg-block h-100">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 overflow-y-auto">
            <h6 className="fw-bold text-dark mb-2">Suggested Queries</h6>
            <p className="extra-small text-muted mb-3">Click any analytical blueprint prompt macro to execute prompt sequences instantly:</p>
            <div className="d-flex flex-column gap-2">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn btn-light text-start border border-light-subtle rounded-3 small p-2.5 hover-sidebar-btn transition-all text-dark fw-medium bg-opacity-10"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                  style={{ fontSize: "0.82rem" }}
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .max-w-75 { max-width: 75% !important; }
        .style-scroll-chat::-webkit-scrollbar { width: 4px; }
        .style-scroll-chat::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .hover-sidebar-btn:hover { background-color: #f1f5f9 !important; border-color: #cbd5e1 !important; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}