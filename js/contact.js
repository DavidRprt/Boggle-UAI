"use strict"

// Declare all global variables at the beginning
var nameIsValid,
  emailIsValid,
  messageIsValid,
  userName,
  email,
  message,
  recipientEmail,
  subject,
  mailtoLink,
  modal,
  modalMessage

// Function to show the modal with the error message
function showModal(message) {
  modal = document.getElementById("modal")
  modalMessage = document.getElementById("modal-message")
  modalMessage.textContent = message
  modal.style.display = "block"
}

// Function to handle modal close button click
function closeModal() {
  modal = document.getElementById("modal")
  modal.style.display = "none"
}

// Function to handle click outside the modal to close it
function windowOnClick(event) {
  modal = document.getElementById("modal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault()

  userName = document.getElementById("name").value.trim()
  email = document.getElementById("email").value.trim()
  message = document.getElementById("message").value.trim()

  // Validations
  nameIsValid = /^[a-zA-Z0-9 ]+$/.test(userName)
  emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  messageIsValid = message.length > 5

  if (!nameIsValid) {
    showModal("El nombre debe ser alfanumérico.")
    return
  }

  if (!emailIsValid) {
    showModal("El email no es válido.")
    return
  }

  if (!messageIsValid) {
    showModal("El mensaje debe tener más de 5 caracteres.")
    return
  }

  recipientEmail = "David.KahanRapoport@alumnos.uai.edu.ar"
  subject = "Contacto - " + userName
  mailtoLink =
    "mailto:" + recipientEmail + "?subject=" + subject + "&body=" + message
  window.location.href = mailtoLink
}

// Event listeners
document
  .getElementById("contactForm")
  .addEventListener("submit", handleFormSubmit)
document.querySelector(".close-button").addEventListener("click", closeModal)
window.addEventListener("click", windowOnClick)
