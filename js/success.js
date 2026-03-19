/**
 * Success page – Return to Login redirects to home.
 */
document.addEventListener('DOMContentLoaded', () => {
    const returnButton = document.getElementById('return-button');
    if (returnButton) {
        returnButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});