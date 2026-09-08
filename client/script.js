const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// const API_URL = "http://localhost:3000/api/chat";
const API_URL = "http://localhost:3000/api/chat";

let conversation = [];

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();

  if (!userMessage) return;

  // Tampilkan pesan user
  appendMessage("user", userMessage);

  // Simpan percakapan
  conversation.push({
    role: "user",
    text: userMessage,
  });

  input.value = "";

  // Tampilkan indikator loading
  const loadingMessage = appendMessage(
    "bot",
    "School Assistant sedang berpikir...",
  );

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: conversation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Terjadi kesalahan pada server",
      );
    }

    // Hapus pesan loading
    loadingMessage.remove();

    const botResponse =
      data.result || "Maaf, School Assistant tidak memberikan jawaban.";

    // Tampilkan jawaban Gemini
    appendMessage("bot", botResponse);

    // Simpan jawaban bot
    conversation.push({
      role: "model",
      text: botResponse,
    });
  } catch (error) {
    console.error("Error:", error);

    loadingMessage.textContent =
      "Maaf, terjadi kesalahan saat menghubungkan ke server.";

    appendMessage("bot", `Error: ${error.message}`);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");

  msg.classList.add("message", sender);
  msg.textContent = text;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg;
}
