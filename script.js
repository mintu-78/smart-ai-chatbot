import { API_KEY } from "./config.js";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");


function addMessage(message, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}


function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.textContent = "AI is typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}



async function askAI(message) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
                { role: "user", content: message }
            ]
        })
    });

    const data = await res.json();
    console.log(data.choices[0].message.content);
    return data
}

sendBtn.onclick = async () => {
    const message = userInput.value.trim();
    if (message === "") return;
    console.log(message);

    addMessage(message, "user-message");
    userInput.value = "";

    const typingDiv = showTyping();

    const botReplay = await askAI(message);
    typingDiv.remove();
    const botMessage = botReplay.choices[0].message.content;

    addMessage(botMessage, "bot-message");
    localStorage.setItem("ChatHistory", chatBox.innerHTML);

}

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
})