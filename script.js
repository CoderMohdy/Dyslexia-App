// Text Formatting Functions
function adjustFontSize() {
    const size = document.getElementById('font-size').value;
    document.getElementById('text-sample').style.fontSize = size + 'px';
}

function adjustFontFamily() {
    const fontFamily = document.getElementById('font-family').value;
    document.body.style.fontFamily = fontFamily;
}

function adjustLineSpacing() {
    const spacing = document.getElementById('line-spacing').value;
    document.body.style.lineHeight = spacing;
}

function adjustBgColor() {
    const color = document.getElementById('bg-color').value;
    document.body.style.backgroundColor = color;
}

// Text-to-Speech Function
let speechRate = 1;

function updateSpeechRate() {
    speechRate = document.getElementById('speech-rate').value;
}

function startTTS() {
    const text = document.getElementById('tts-text').value;
    if (text.trim()) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speechRate;
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Please enter text to read aloud.');
    }
}

// Speech-to-Text Function
function startSTT() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('stt-result').textContent = transcript;
    };

    recognition.onerror = (event) => {
        alert('Error occurred in speech recognition: ' + event.error);
    };
}

// Word Highlighting and Reading Function
function highlightAndRead() {
    const text = document.getElementById('highlight-text');
    const words = text.textContent.split(' ');

    let index = 0;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = words[index];
    utterance.rate = speechRate;

    utterance.onend = function() {
        if (index < words.length - 1) {
            index++;
            utterance.text = words[index];
            text.innerHTML = words.map((word, i) => `<span style="${i === index ? 'background-color: yellow;' : ''}">${word}</span>`).join(' ');
            window.speechSynthesis.speak(utterance);
        }
    };

    window.speechSynthesis.speak(utterance);
}

// Dictionary Lookup Function using a free API
async function showDefinition() {
    const word = document.getElementById('dictionary-input').value;
    const apiKey = 'YOUR_FREE_DICTIONARY_API_KEY';
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok && data[0]) {
            const meaning = data[0].meanings[0].definitions[0].definition;
            document.getElementById('definition-result').textContent = meaning;
        } else {
            document.getElementById('definition-result').textContent = "Word not found.";
        }
    } catch (error) {
        document.getElementById('definition-result').textContent = "Error retrieving definition.";
    }
}
