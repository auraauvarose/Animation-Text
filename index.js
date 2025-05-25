// State variables
let currentText = "i love you";
let currentTextColor = "#39FF14"; // Neon Green
let currentBackgroundColor = "#000000"; // Black
let currentFontSize = 20; // pixels
let isBold = false;
let isItalic = false;
let hasTextShadow = false;
const PREDEFINED_TEXT_SHADOW = "2px 2px 5px rgba(0,0,0,0.7)";
let currentBackgroundImage = null; // For storing Data URL of the background image

let currentSpeed = 1.5; // Tambahkan variabel kecepatan default

const fallSpeed = 1.5; // pixels per frame
const spawnInterval = 150; // milliseconds, for denser rain

// LocalStorage Keys
const TEXT_STORAGE_KEY = 'fallingTextApp_text';
const TEXT_COLOR_STORAGE_KEY = 'fallingTextApp_textColor';
const BG_COLOR_STORAGE_KEY = 'fallingTextApp_bgColor';
const FONT_SIZE_STORAGE_KEY = 'fallingTextApp_fontSize';
const BOLD_STORAGE_KEY = 'fallingTextApp_isBold';
const ITALIC_STORAGE_KEY = 'fallingTextApp_isItalic';
const SHADOW_STORAGE_KEY = 'fallingTextApp_hasTextShadow';
const BG_IMAGE_STORAGE_KEY = 'fallingTextApp_backgroundImage';
const SPEED_STORAGE_KEY = 'fallingTextApp_speed'; // Tambahkan key localStorage


// DOM Elements
let appContainer = null;
let textInput = null;
let textColorInput = null;
let bgColorInput = null;
let fontSizeInput = null;
let fontSizeValueSpan = null;
let controlsToggleButton = null;
let controlsPanel = null;
let boldToggle = null;
let italicToggle = null;
let shadowToggle = null;
let bgImageInput = null;
let clearBgImageButton = null;

// Hapus variabel speedInput dan speedValueSpan
let speedSelect = null;

function initDOMReferences() {
    appContainer = document.getElementById('app-container');
    textInput = document.getElementById('text-input');
    textColorInput = document.getElementById('text-color-input');
    bgColorInput = document.getElementById('bg-color-input');
    fontSizeInput = document.getElementById('font-size-input');
    fontSizeValueSpan = document.getElementById('font-size-value');
    controlsToggleButton = document.getElementById('controls-toggle-button');
    controlsPanel = document.getElementById('controls-panel');
    boldToggle = document.getElementById('bold-toggle');
    italicToggle = document.getElementById('italic-toggle');
    shadowToggle = document.getElementById('shadow-toggle');
    bgImageInput = document.getElementById('bg-image-input');
    clearBgImageButton = document.getElementById('clear-bg-image-button');
    speedSelect = document.getElementById('speed-select');
}

function updateRootVariables() {
    if (document.documentElement) {
        document.documentElement.style.setProperty('--text-color', currentTextColor);
        document.documentElement.style.setProperty('--background-color', currentBackgroundColor);
        document.documentElement.style.setProperty('--font-size', `${currentFontSize}px`);
        document.documentElement.style.setProperty('--font-weight', isBold ? 'bold' : 'normal');
        document.documentElement.style.setProperty('--font-style', isItalic ? 'italic' : 'normal');
        document.documentElement.style.setProperty('--text-shadow', hasTextShadow ? PREDEFINED_TEXT_SHADOW : 'none');
        document.documentElement.style.setProperty('--background-image', currentBackgroundImage ? `url(${currentBackgroundImage})` : 'none');
    }
}

function loadSettings() {
    currentText = localStorage.getItem(TEXT_STORAGE_KEY) || "i love you";
    currentTextColor = localStorage.getItem(TEXT_COLOR_STORAGE_KEY) || "#39FF14";
    currentBackgroundColor = localStorage.getItem(BG_COLOR_STORAGE_KEY) || "#000000";
    currentFontSize = parseInt(localStorage.getItem(FONT_SIZE_STORAGE_KEY) || "20", 10);
    isBold = localStorage.getItem(BOLD_STORAGE_KEY) === 'true';
    isItalic = localStorage.getItem(ITALIC_STORAGE_KEY) === 'true';
    hasTextShadow = localStorage.getItem(SHADOW_STORAGE_KEY) === 'true';
    currentBackgroundImage = localStorage.getItem(BG_IMAGE_STORAGE_KEY); // Can be null
    currentSpeed = parseFloat(localStorage.getItem(SPEED_STORAGE_KEY) || "1.5");
}

function saveSettings() {
    localStorage.setItem(TEXT_STORAGE_KEY, currentText);
    localStorage.setItem(TEXT_COLOR_STORAGE_KEY, currentTextColor);
    localStorage.setItem(BG_COLOR_STORAGE_KEY, currentBackgroundColor);
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, currentFontSize.toString());
    localStorage.setItem(BOLD_STORAGE_KEY, isBold.toString());
    localStorage.setItem(ITALIC_STORAGE_KEY, isItalic.toString());
    localStorage.setItem(SHADOW_STORAGE_KEY, hasTextShadow.toString());
    if (currentBackgroundImage) {
        localStorage.setItem(BG_IMAGE_STORAGE_KEY, currentBackgroundImage);
    } else {
        localStorage.removeItem(BG_IMAGE_STORAGE_KEY);
    }
    localStorage.setItem(SPEED_STORAGE_KEY, currentSpeed.toString());
}


function createFallingTextElement() {
    if (!appContainer || currentText.trim() === "") return;

    const textElement = document.createElement('div');
    textElement.classList.add('falling-text');
    textElement.textContent = currentText;
    
    const fontSize = Number(currentFontSize) || 20;
    // Estimate width to prevent text going off-screen too much. This is a rough estimate.
    const approxTextWidth = currentText.length * (fontSize * 0.6); 
    const maxLeft = Math.max(0, window.innerWidth - approxTextWidth - 10); // 10 for some padding
    textElement.style.left = `${Math.random() * maxLeft}px`;
    // Start further up to ensure it's fully off-screen initially
    textElement.style.top = `-${fontSize * 2}px`; 

    appContainer.appendChild(textElement);
}

function animateRain() {
    if (!appContainer) return;

    const textElements = appContainer.querySelectorAll('.falling-text');
    
    textElements.forEach(element => {
        let currentTop = parseFloat(element.style.top || "0");
        currentTop += currentSpeed; // Gunakan currentSpeed

        if (currentTop > window.innerHeight) {
            element.remove();
        } else {
            element.style.top = `${currentTop}px`;
        }
    });

    requestAnimationFrame(animateRain);
}

function setupControls() {
    if (!textInput || !textColorInput || !bgColorInput || !fontSizeInput || !fontSizeValueSpan || 
        !controlsToggleButton || !controlsPanel || !boldToggle || !italicToggle || !shadowToggle ||
        !bgImageInput || !clearBgImageButton || !speedSelect) {
        console.error("One or more control elements are missing from the DOM. Setup cannot complete.");
        return;
    }

    // Set initial values from loaded settings
    textInput.value = currentText;
    textColorInput.value = currentTextColor;
    bgColorInput.value = currentBackgroundColor;
    fontSizeInput.value = currentFontSize.toString();
    if (fontSizeValueSpan) {
        fontSizeValueSpan.textContent = `${currentFontSize}px`;
    }
    boldToggle.checked = isBold;
    italicToggle.checked = isItalic;
    shadowToggle.checked = hasTextShadow;
    // Set nilai awal speed-select dari currentSpeed
    if (speedSelect) {
        speedSelect.value = String(currentSpeed);
    }
    // Note: bgImageInput doesn't need a value set here, its state is handled by the presence of currentBackgroundImage
    
    updateRootVariables(); // Apply loaded settings to CSS


    textInput.addEventListener('input', (e) => {
        currentText = e.target.value || "i love you";
        saveSettings();
    });

    textColorInput.addEventListener('input', (e) => {
        currentTextColor = e.target.value;
        updateRootVariables();
        saveSettings();
    });

    bgColorInput.addEventListener('input', (e) => {
        currentBackgroundColor = e.target.value;
        updateRootVariables();
        saveSettings();
    });

    fontSizeInput.addEventListener('input', (e) => {
        currentFontSize = parseInt(e.target.value, 10);
        if (fontSizeValueSpan) {
             fontSizeValueSpan.textContent = `${currentFontSize}px`;
        }
        updateRootVariables();
        saveSettings();
    });

    boldToggle.addEventListener('change', (e) => {
        isBold = e.target.checked;
        updateRootVariables();
        saveSettings();
    });

    italicToggle.addEventListener('change', (e) => {
        isItalic = e.target.checked;
        updateRootVariables();
        saveSettings();
    });

    shadowToggle.addEventListener('change', (e) => {
        hasTextShadow = e.target.checked;
        updateRootVariables();
        saveSettings();
    });

    controlsToggleButton.addEventListener('click', () => {
        const isExpanded = controlsToggleButton.getAttribute('aria-expanded') === 'true' || false;
        controlsToggleButton.setAttribute('aria-expanded', (!isExpanded).toString());
        if (controlsPanel) {
            controlsPanel.classList.toggle('open');
            controlsPanel.setAttribute('aria-hidden', isExpanded.toString());
        }
    });

    bgImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentBackgroundImage = event.target.result;
                updateRootVariables();
                saveSettings();
            };
            reader.readAsDataURL(file);
        }
    });

    clearBgImageButton.addEventListener('click', () => {
        currentBackgroundImage = null;
        bgImageInput.value = null; // Reset file input
        updateRootVariables();
        saveSettings();
    });

    // Event listener untuk speed-select
    if (speedSelect) {
        speedSelect.addEventListener('change', (e) => {
            currentSpeed = parseFloat(e.target.value);
            saveSettings();
        });
    }
}


function init() {
    initDOMReferences(); 
    loadSettings(); // Load settings from localStorage

    if (!appContainer) {
        console.error("App container not found. Animation cannot start.");
        return;
    }
    setupControls(); // This will also call updateRootVariables initially
    setInterval(createFallingTextElement, spawnInterval);
    requestAnimationFrame(animateRain);
}

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', init);
