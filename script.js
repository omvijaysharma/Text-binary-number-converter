// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const inputTypeSelect = document.getElementById('inputType');
const outputTypeSelect = document.getElementById('outputType');
const inputTextArea = document.getElementById('inputText');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const copyInputBtn = document.getElementById('copyInputBtn');
const resultOutput = document.getElementById('resultOutput');
const copyResultBtn = document.getElementById('copyResultBtn');
const saveResultBtn = document.getElementById('saveResultBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const notification = document.getElementById('notification');
const themeOptions = document.querySelectorAll('.theme-option');
const autoCopyCheckbox = document.getElementById('autoCopyCheckbox');
const saveHistoryCheckbox = document.getElementById('saveHistoryCheckbox');

// Conversion history array
let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Initialize the app
function init() {
    // Load saved settings
    loadSettings();
    
    // Load history
    loadHistory();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Convert button
    convertBtn.addEventListener('click', convert);
    
    // Clear button
    clearBtn.addEventListener('click', clearInputs);
    
    // Copy buttons
    copyInputBtn.addEventListener('click', () => copyToClipboard(inputTextArea.value, 'Input copied to clipboard!'));
    copyResultBtn.addEventListener('click', () => copyToClipboard(resultOutput.textContent, 'Result copied to clipboard!'));
    
    // Save result button
    saveResultBtn.addEventListener('click', saveToHistory);
    
    // Clear history button
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            setTheme(theme);
        });
    });
    
    // Settings checkboxes
    autoCopyCheckbox.addEventListener('change', saveSettings);
    saveHistoryCheckbox.addEventListener('change', saveSettings);
    
    // Keyboard shortcut for conversion (Ctrl+Enter)
    inputTextArea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            convert();
        }
    });
}

// Switch between tabs
function switchTab(tabId) {
    // Update active tab button
    tabButtons.forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-tab') === tabId);
    });
    
    // Show corresponding tab content
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}-tab`);
    });
}

// Conversion functions
function textToBinary(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
}

function binaryToText(binary) {
    // Remove any non-binary characters (except spaces which separate bytes)
    const cleanBinary = binary.replace(/[^01\s]/g, '');
    return cleanBinary.split(/\s+/).map(bin => {
        return String.fromCharCode(parseInt(bin, 2));
    }).join('');
}

function numberToBinary(number) {
    return parseInt(number).toString(2);
}

function binaryToNumber(binary) {
    return parseInt(binary, 2);
}

function textToHex(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(16).padStart(2, '0');
    }).join(' ');
}

function hexToText(hex) {
    const cleanHex = hex.replace(/[^0-9a-fA-F\s]/g, '');
    return cleanHex.split(/\s+/).map(h => {
        return String.fromCharCode(parseInt(h, 16));
    }).join('');
}

function numberToHex(number) {
    return parseInt(number).toString(16);
}

function hexToNumber(hex) {
    return parseInt(hex, 16);
}

function textToDecimal(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0);
    }).join(' ');
}

function decimalToText(decimal) {
    const cleanDecimal = decimal.replace(/[^0-9\s]/g, '');
    return cleanDecimal.split(/\s+/).map(dec => {
        return String.fromCharCode(parseInt(dec));
    }).join('');
}

function textToBase64(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

function base64ToText(base64) {
    try {
        return decodeURIComponent(escape(atob(base64)));
    } catch (e) {
        return "Invalid Base64 input";
    }
}

// Main conversion function
function convert() {
    const inputType = inputTypeSelect.value;
    const outputType = outputTypeSelect.value;
    const input = inputTextArea.value.trim();
    
    if (!input) {
        showResult("Please enter some input to convert");
        return;
    }
    
    let result;
    
    try {
        // Handle all possible conversion combinations
        if (inputType === 'text' && outputType === 'binary') {
            result = textToBinary(input);
        } else if (inputType === 'binary' && outputType === 'text') {
            result = binaryToText(input);
        } else if (inputType === 'text' && outputType === 'hex') {
            result = textToHex(input);
        } else if (inputType === 'hex' && outputType === 'text') {
            result = hexToText(input);
        } else if (inputType === 'text' && outputType === 'decimal') {
            result = textToDecimal(input);
        } else if (inputType === 'decimal' && outputType === 'text') {
            result = decimalToText(input);
        } else if (inputType === 'text' && outputType === 'base64') {
            result = textToBase64(input);
        } else if (inputType === 'base64' && outputType === 'text') {
            result = base64ToText(input);
        } else if (inputType === 'binary' && outputType === 'decimal') {
            result = binaryToNumber(input);
        } else if (inputType === 'decimal' && outputType === 'binary') {
            result = numberToBinary(input);
        } else if (inputType === 'hex' && outputType === 'decimal') {
            result = hexToNumber(input);
        } else if (inputType === 'decimal' && outputType === 'hex') {
            result = numberToHex(input);
        } else if (inputType === 'binary' && outputType === 'hex') {
            const decimal = binaryToNumber(input);
            result = numberToHex(decimal);
        } else if (inputType === 'hex' && outputType === 'binary') {
            const decimal = hexToNumber(input);
            result = numberToBinary(decimal);
        } else if (inputType === outputType) {
            result = input; // No conversion needed
        } else {
            result = "Conversion not supported yet";
        }
    } catch (error) {
        result = `Error: ${error.message}`;
    }
    
    showResult(result);
    
    // Auto-copy if enabled
    if (autoCopyCheckbox.checked) {
        copyToClipboard(result, 'Result automatically copied to clipboard!');
    }
}

// Display the result
function showResult(result) {
    resultOutput.textContent = result;
    
    // Add syntax highlighting for binary and hex
    if (outputTypeSelect.value === 'binary') {
        resultOutput.innerHTML = result.replace(/([01]{8})/g, '<span class="binary-byte">$1</span>');
    } else if (outputTypeSelect.value === 'hex') {
        resultOutput.innerHTML = result.replace(/([0-9a-fA-F]{2})/g, '<span class="hex-byte">$1</span>');
    }
}

// Clear input and result
function clearInputs() {
    inputTextArea.value = '';
    resultOutput.textContent = '';
}

// Copy text to clipboard
function copyToClipboard(text, message = 'Copied to clipboard!') {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification(message);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard');
    });
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Save conversion to history
function saveToHistory() {
    const inputType = inputTypeSelect.value;
    const outputType = outputTypeSelect.value;
    const input = inputTextArea.value.trim();
    const output = resultOutput.textContent;
    
    if (!input || !output) return;
    
    const conversion = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        inputType,
        outputType,
        input,
        output
    };
    
    conversionHistory.unshift(conversion);
    
    // Keep only the last 50 conversions
    if (conversionHistory.length > 50) {
        conversionHistory = conversionHistory.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    
    // Update history display
    loadHistory();
    
    showNotification('Conversion saved to history');
}

// Load conversion history
function loadHistory() {
    if (!saveHistoryCheckbox.checked) return;
    
    historyList.innerHTML = '';
    
    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No conversion history yet</p>';
        return;
    }
    
    conversionHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-item-header">
                <span>${new Date(item.timestamp).toLocaleString()}</span>
                <span>${item.inputType} → ${item.outputType}</span>
            </div>
            <div class="history-item-content">
                <div class="history-item-input">
                    <strong>Input:</strong>
                    <div>${item.input}</div>
                </div>
                <div class="history-item-output">
                    <strong>Output:</strong>
                    <div>${item.output}</div>
                </div>
            </div>
            <div class="history-item-actions">
                <button class="btn icon" data-id="${item.id}" title="Copy Input">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn icon" data-id="${item.id}" title="Copy Output">
                    <i class="fas fa-clipboard"></i>
                </button>
                <button class="btn icon danger" data-id="${item.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
    
    // Add event listeners to history item buttons
    document.querySelectorAll('.history-item-actions button').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(button.getAttribute('data-id'));
            const item = conversionHistory.find(item => item.id === id);
            
            if (!item) return;
            
            if (button.querySelector('.fa-copy')) {
                copyToClipboard(item.input, 'Input copied from history!');
            } else if (button.querySelector('.fa-clipboard')) {
                copyToClipboard(item.output, 'Output copied from history!');
            } else if (button.querySelector('.fa-trash')) {
                deleteHistoryItem(id);
            }
        });
    });
}

// Delete a history item
function deleteHistoryItem(id) {
    conversionHistory = conversionHistory.filter(item => item.id !== id);
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    loadHistory();
    showNotification('Item deleted from history');
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all conversion history?')) {
        conversionHistory = [];
        localStorage.removeItem('conversionHistory');
        loadHistory();
        showNotification('History cleared');
    }
}

// Theme management
function setTheme(theme) {
    document.body.className = theme;
    
    // Update active theme button
    themeOptions.forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-theme') === theme);
    });
    
    // Save theme preference
    localStorage.setItem('theme', theme);
}

// Load saved settings
function loadSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Load checkbox states
    autoCopyCheckbox.checked = localStorage.getItem('autoCopy') !== 'false';
    saveHistoryCheckbox.checked = localStorage.getItem('saveHistory') !== 'false';
    
    // If history is disabled, clear it
    if (!saveHistoryCheckbox.checked) {
        localStorage.removeItem('conversionHistory');
        conversionHistory = [];
    }
}

// Save settings
function saveSettings() {
    localStorage.setItem('autoCopy', autoCopyCheckbox.checked);
    localStorage.setItem('saveHistory', saveHistoryCheckbox.checked);
    
    // If history was just disabled, clear it
    if (!saveHistoryCheckbox.checked) {
        localStorage.removeItem('conversionHistory');
        conversionHistory = [];
        loadHistory();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);