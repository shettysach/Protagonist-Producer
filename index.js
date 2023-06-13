import { process } from '/env'
import { Configuration, OpenAIApi } from 'openai'

const setupInputContainer = document.getElementById('setup-input-container')
const IntroText = document.getElementById('intro-text')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
  const setupTextarea = document.getElementById('setup-textarea') 
  if (setupTextarea.value) {
    const userInput = setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`

  fetchBotReply()
  fetchName(userInput)
  }
}) 

async function fetchBotReply(){
  IntroText.innerText = "Your character is being created"
}


async function fetchName(outline){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate a short and creative character name for a character described by "${outline}. It should fit the genre and settings of the character.`,
    max_tokens: 15
  })
  const name = response.data.choices[0].text.trim()
  document.getElementById('output-title').innerText = name 
  fetchImage(outline, name)
  fetchSynopsis(outline, name)
}

async function fetchSynopsis(outline, name){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate an engaging backstory for a character based on the idea "${outline} and name ${name}"
    
    Outline: ${outline}
    
    Make sure it has
    Character name
    Occupation/ Motivations/ Ambitions
    Synopsis / Backstory: 
    `,
    max_tokens: 150
  })
  const synopsis = response.data.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis

}

async function fetchImage(outline, name){
  const response = await openai.createImage({
    prompt: `Create a character portrait for ${outline} with name ${name}. The portrait should have an appropriate background and artstyle. 
    Keep in mind the genre, setting. The image should contain no text`,
    n: 1,
    size : '256x256',
    response_format: 'b64_json'
  })
  document.getElementById('output-img-container').innerHTML = `<img src="data:/image/png;base64,${response.data.data[0].b64_json}">`
    
  setupInputContainer.innerHTML = `<button id = "view-char-btn" class = "view-char-btn">View your Character</button>`
  IntroText.innerText = 'Your character has been created.'
  document.getElementById('view-char-btn').addEventListener('click', ()=>{
      document.getElementById('setup-container').style.display = 'none'
      document.getElementById('output-container').style.display = 'flex'
  })
}
