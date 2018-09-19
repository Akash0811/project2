// Set starting value of counter to 0
if (!localStorage.getItem('name'))
    localStorage.setItem('name','');

// Load current value of  display_name
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#name').innerHTML = localStorage.getItem('name');

    // alert item in local storage
    document.querySelector('button').onclick = () => {
        // Increment current counter
        let name = document.querySelector('#display_name').value;

        localStorage.setItem('name', name);
        document.querySelector('#name').innerHTML = localStorage.getItem('name');

    }
});

/*document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#form').onsubmit = () => {

        // Initialize new request
        const request = new XMLHttpRequest();
        const currency = document.querySelector('#currency').value;
        request.open('POST', '/convert');

        // Callback function for when request completes
        request.onload = () => {

            // Extract JSON data from request
            const data = JSON.parse(request.responseText);

            // Update the result div
            if (data.success) {
                const contents = `1 USD is equal to ${data.rate} ${currency}.`
                document.querySelector('#result').innerHTML = contents;
            }
            else {
                document.querySelector('#result').innerHTML = 'There was an error.';
            }
        }

        // Add data to send with request
        const data = new FormData();
        data.append('currency', currency);

        // Send request
        request.send(data);
        return false;
    };

});
*/
