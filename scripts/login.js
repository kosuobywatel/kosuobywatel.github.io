document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Sprawdzenie danych (w tym przypadku symulacja)
    if (username === 'arriderx' && password === 'Filip1511@') {
        alert('Zalogowano pomyœlnie!');
        // Mo¿esz przekierowaæ na stronê dashboardu
        window.location.href = 'dashboard.html';
    } else {
        alert('Nieprawid³owa nazwa u¿ytkownika lub has³o.');
    }
});
