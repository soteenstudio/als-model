fetch('http://sayals.free.nf/endpoint.php', {
    method: 'GET',
    headers: {
        'API-Key': 'fa1fa81be1d28b6901bf797efd6b44164550dae259b975a32a'
    }
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));