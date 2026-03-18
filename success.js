document.addEventListener('DOMContentLoaded', () => {
    const returnButton = document.getElementById('return-button');
    
    if (returnButton) {
        returnButton.addEventListener('click', () => {
            // Redirects the user back to your main login page
            window.location.href = 'index.html'; 
        });
    }
});