import { apiKey} from "./config.js";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn =  document.getElementById("send-btn");


function addMessage(message,className){
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message",className);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}


function showTyping(){
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message","bot-message");
    typingDiv.textContent = "AI is typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}


async function getBotReplay (userMessage){
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(url,{
            method: "POST",
            headers: {"Content-type":"application/json"},
            body:JSON.stringify({
                contents:[{parts:[{text:userMessage}]}]
            })
        })

        const data = await response.json();

        if(!response.ok){
            console.error("API Error:",data);
            return data?.error?.message || "Error fething response."
        }

        return(
            data.candidates?.[0]?.content?.parts?.[0]?.text || "sorry, I couldn't get that."
        )
    } catch (error){

    }
}


sendBtn.onclick = async() => {
    const message = userInput.value.trim();
    if(message === "") return;
    addMessage(message, "user-message");
    userInput.value = "";

    const typingDiv = showTyping();

    const botReplay = await getBotReplay(message);
    typingDiv.remove();
    addMessage(botReplay,"bot-message");
    localStorage.setItem("ChatHistory",chatBox.innerHTML);

}

userInput.addEventListener("keypress",(e) =>{
    if(e.key === "Enter") sendBtn.click();
})