var myInput = document.getElementById("password");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var passwordlength = document.getElementById("passwordlength");
var registerButton = document.getElementById("register");

registerButton.disabled = true;

// When the user clicks on the password field, show the message box
myInput.onfocus = function () {
    document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function () {
    document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function () {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (myInput.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validate length
    if (myInput.value.length >= 8) {
        length.classList.remove("invalid");
        length.classList.add("valid"); confirmPassword.disabled = false;
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
        length.classList.add("valid"); confirmPassword.disabled =true;
    }
}

var confirmPassword = document.getElementById("password2");
confirmPassword.disabled = true;
confirmPassword.onfocus = function () {
    document.getElementById("message2").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
confirmPassword.onblur = function () {
    document.getElementById("message2").style.display = "none";
}

confirmPassword.onkeyup = function () {
    if (confirmPassword.value == myInput.value) {
        passwordlength.innerText = "Passwords match";
        passwordlength.classList.remove("invalid");
        passwordlength.classList.add("valid");
        registerButton.disabled = false;
    } else {
        passwordlength.innerText = "Passwords do not match";
        passwordlength.classList.remove("valid");
        passwordlength.classList.add("invalid");
        registerButton.disabled = true;
    }
}

////Login Section validation
//var email = document.getElementById("loginEmail");
//var password = document.getElementById("loginPassword");
//var loginButton = document.getElementById("loginButton");

//email.onkeyup = function () {

//    if (email == null) {
//        loginButton.disabled = true;
//    }
//}