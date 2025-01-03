function textToBinary(text) {
    return text.split('').map(function (char) {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
}

function binaryToText(binary) {
    return binary.split(' ').map(function (bin) {
        return String.fromCharCode(parseInt(bin, 2));
    }).join('');
}

function numberToBinary(number) {
    return parseInt(number).toString(2);
}

function binaryToNumber(binary) {
    return parseInt(binary, 2);
}

function convert() {
    const option = document.getElementById("option").value;
    const inputText = document.getElementById("inputText").value.trim();
    let result = '';

    if (!inputText) {
        result = "Please enter a valid input.";
    } else {
        switch (option) {
            case 'textToBinary':
                result = textToBinary(inputText);
                break;
            case 'binaryToText':
                result = binaryToText(inputText);
                break;
            case 'numberToBinary':
                if (!isNaN(inputText)) {
                    result = numberToBinary(inputText);
                } else {
                    result = "Invalid number input.";
                }
                break;
            case 'binaryToNumber':
                if (/^[01\s]+$/.test(inputText)) {
                    result = binaryToNumber(inputText);
                } else {
                    result = "Invalid binary input.";
                }
                break;
            default:
                result = "Invalid option.";
        }
    }

    document.getElementById("result").innerText = result;
}