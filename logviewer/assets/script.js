function toggleDarkMode() {
    const body = document.body;
    const messages = document.getElementsByClassName("container");
    const text = document.getElementsByClassName("text");
    const authors = document.getElementsByClassName("author");
    const threadBarrier = document.getElementsByName("hr");
    body.classList.toggle('dark-mode');

    for (let i = 0; i < messages.length; i++) {
        messages[i].classList.toggle('dark-mode');
    }

    for (let i = 0; i < text.length; i++) {
        text[1].classList.toggle('dark-mode-text');
    }

    for (let i = 0; i < authors.length; i++) {
        authors[1].classList.toggle('dark-mode-text');
    }

    threadBarrier.classList.toggle('dark-mode');
}

function goToTicket() {
    const ticketId = document.getElementById("ticketId").value;
    window.location.href = "/logs/" + ticketId;
}