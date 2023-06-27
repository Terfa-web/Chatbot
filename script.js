const chatInput = document.querySelector('.chat-input textarea');
const sendChatButton = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;


function createChatLi(message, className) {
  //create a chat <li> element with passed message and className
  const chatLi = document.createElement('li');
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p>${message}</p>` :`<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
}

//Use openAPI to generate the response

function generateResponse(incomingChatLI) {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLI.querySelector('p');

    const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            
              model: "gpt-3.5-turbo",
              messages: [{"role": "user", "content": userMessage}]
            })
    }

    //Send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => { messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops Something is not right. Please try again sweet Etta";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
userMessage = chatInput.value.trim()
  if(!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  //Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

 
  setTimeout(() => {
     // Display "Thinking..." message while waiting for the response
     const incomingChatLI = createChatLi("thinking...", "incoming")
    chatbox.appendChild(incomingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLI);
  }, 600)
 
}

chatInput.addEventListener("input", () => {
  //Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`

});

chatInput.addEventListener("keyup", (e) => {
  //if Enter key is pressed without Shift key and the window
  // width is greater than 800px, handle the chat
  if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
    
});

sendChatButton.addEventListener('click',handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

