"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./product-chat.module.css";
import qfStyles from "./quote-form.module.css";

function UpgradeModal({ onSuccess, onClose }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Código incorrecto.");
    }
  }

  return (
    <div className={styles.upgOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.upgModal}>
        <button className={qfStyles.qfClose} onClick={onClose} aria-label="Cerrar">×</button>

        {success ? (
          <div className={styles.upgSuccess}>
            <div className={styles.upgSuccessIcon}>✓</div>
            <h3>¡Plan activado!</h3>
            <p>Ya puedes compartir tus datos de contacto directamente.</p>
          </div>
        ) : (
          <>
            <div className={styles.upgHeader}>
              <span className={styles.upgBadge}>Plan Directo</span>
              <div className={styles.upgPrice}>
                <strong>$10</strong>
                <span>/mes</span>
              </div>
              <p className={styles.upgDesc}>Contacto directo con el proveedor — comparte teléfono, correo y redes sin restricciones.</p>
            </div>

            <ul className={styles.upgFeatures}>
              <li>✓ Comparte teléfono y correo</li>
              <li>✓ Links y redes sociales</li>
              <li>✓ Contacto directo sin intermediarios</li>
              <li>✓ Datos completos del proveedor</li>
            </ul>

            <form className={styles.upgForm} onSubmit={handleSubmit}>
              <label className={styles.upgLabel}>Código de pago</label>
              <input
                className={styles.upgInput}
                type="text"
                placeholder="Ingresa tu código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                autoFocus
              />
              {error && <p className={styles.upgError}>{error}</p>}
              <button className={styles.upgBtn} type="submit" disabled={loading || !code.trim()}>
                {loading ? "Verificando..." : "Activar plan · $10/mes"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductChat({ productId, productName, onClose }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async (convId) => {
    const res = await fetch(`/api/conversations/${convId}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.conversation.messages);
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const meRes = await fetch("/api/account");
      if (!meRes.ok) {
        setError("Debes iniciar sesión para contactar al proveedor.");
        setLoading(false);
        return;
      }
      const meData = await meRes.json();
      setCurrentUserId(meData.user?.id);

      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        setError("No se pudo abrir el chat.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setConversationId(data.conversation.id);
      setMessages(data.conversation.messages);
      setLoading(false);
    }

    init();
  }, [productId]);

  useEffect(() => {
    if (!conversationId) return;
    scrollToBottom();
    pollRef.current = setInterval(() => fetchMessages(conversationId), 3000);
    return () => clearInterval(pollRef.current);
  }, [conversationId, fetchMessages, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || sending || !conversationId) return;
    setSending(true);
    setSendError(null);

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });

    setSending(false);
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setInput("");
      inputRef.current?.focus();
    } else {
      const data = await res.json();
      if (data.error === "PLAN_REQUIRED") {
        setSendError("plan_required");
      } else {
        setSendError(data.error || "No se pudo enviar el mensaje.");
      }
    }
  }

  function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }

  if (loading) {
    return (
      <div className={styles.pcLoading}>
        <div className={styles.pcSpinner} />
        <p>Conectando con el proveedor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pcError}>
        <p>{error}</p>
        <a href="/login" className={styles.pcLoginBtn}>Iniciar sesión</a>
      </div>
    );
  }

  return (
    <>
      <div className={styles.pcChat}>
        <div className={styles.pcChatHeader}>
          <div className={styles.pcChatHeaderInfo}>
            <span className={styles.pcOnlineDot} />
            <div>
              <p className={styles.pcChatProduct}>{productName}</p>
              <p className={styles.pcChatStatus}>Chat con proveedor</p>
            </div>
          </div>
        </div>

        <div className={styles.pcMessages}>
          {messages.length === 0 && (
            <div className={styles.pcEmpty}>
              <p>Envía un mensaje para empezar la conversación con el proveedor.</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender.id === currentUserId;
            return (
              <div key={msg.id} className={`${styles.pcMsg} ${isMine ? styles.pcMsgMine : styles.pcMsgTheirs}`}>
                {!isMine && <span className={styles.pcMsgName}>{msg.sender.fullName}</span>}
                <div className={styles.pcBubble}>{msg.content}</div>
                <span className={styles.pcMsgTime}>{formatTime(msg.createdAt)}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {sendError && (
          <div className={styles.pcSendError}>
            {sendError === "plan_required" ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>No puedes compartir datos en el plan gratuito.&nbsp;</span>
                <button className={styles.pcUpgradeLink} onClick={() => { setSendError(null); setShowUpgrade(true); }}>
                  Activar Plan Directo · $10/mes →
                </button>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {sendError}
              </>
            )}
          </div>
        )}

        <form className={styles.pcInputRow} onSubmit={sendMessage}>
          <input
            ref={inputRef}
            className={styles.pcInput}
            type="text"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
            autoFocus
          />
          <button className={styles.pcSendBtn} type="submit" disabled={sending || !input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => { setShowUpgrade(false); setSendError(null); }}
        />
      )}
    </>
  );
}
