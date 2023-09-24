const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.getElementById('command-input');

commandInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command === 'ls') {
            // Simulate the 'ls' command (list files)
            fetch('/list-files')  // Replace with your server endpoint for listing files
                .then(response => response.json())
                .then(data => {
                    terminalOutput.innerHTML += '<div class="prompt">$-root: ls</div>';
                    terminalOutput.innerHTML += '<pre>List of files:\n' + data.files.join('\n') + '</pre>';
                })
                .catch(error => {
                    terminalOutput.innerHTML += '<div class="prompt">$-root: ls</div>';
                    terminalOutput.innerHTML += `<pre>Error: ${error.message}</pre>`;
                });
        } else if (command.startsWith('download')) {
            // Extract the filename from the 'download' command
            const fileName = command.substring('download '.length).trim();
            if (fileName === '') {
                terminalOutput.innerHTML += '<div class="prompt">$-root: download</div>';
                terminalOutput.innerHTML += '<pre>No filename included.</pre>';
            } else {
                // Simulate the 'download' command (download files)
                terminalOutput.innerHTML += `<div class="prompt">$-root: download ${fileName}</div>`;
                terminalOutput.innerHTML += `<pre>Downloading ${fileName}...</pre>`;

                // Trigger the file download
                fetch(`/download/${fileName}`)
                    .then(response => {
                        if (response.ok) {
                            // If the response is successful, trigger the download
                            response.blob().then(blob => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = fileName;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                            });
                        } else {
                            // Handle the error accordingly
                            terminalOutput.innerHTML += '<pre>No such file present.</pre>';
                        }
                    })
                    .catch(error => {
                        // Handle the error accordingly
                        terminalOutput.innerHTML += `<pre>Error: ${error.message}</pre>`;
                    });
            }
        }else if (command.startsWith('cat')) {
            // Extract the filename from the 'cat' command
            const fileName = command.substring('cat '.length).trim();
            if (fileName === '') {
                terminalOutput.innerHTML += '<div class="prompt">$-root: cat</div>';
                terminalOutput.innerHTML += '<pre>No filename included.</pre>';
            } else {
                // Simulate the 'cat' command (read files)
                terminalOutput.innerHTML += `<div class="prompt">$-root: cat ${fileName}</div>`;
                terminalOutput.innerHTML += `<pre>Reading ${fileName}...</pre>`;
        
                // Read and display the file content without JSON formatting
                fetch(`/read-file/${fileName}`)
                    .then(response => {
                        if (response.ok) {
                            return response.text(); // Read file as text
                        } else {
                            throw new Error('File not found.');
                        }
                    })
                    .then(content => {
                        // Display the file content without any JSON formatting
                        terminalOutput.innerHTML += `${content}`;
                    })
                    .catch(error => {
                        terminalOutput.innerHTML += `<pre>Error: ${error.message}</pre>`;
                    });
            }
        } else if (command === 'clear') {
            // Clear the terminal
            terminalOutput.innerHTML = '';
        } else if (command === 'help') {
            // Display a list of available commands
            terminalOutput.innerHTML += '<div class="prompt">$-root: help</div>';
            terminalOutput.innerHTML += '<pre>Available commands:\nls - List files\ndownload [filename] - Download a file\ncat [filename] - Display file content\nclear - Clear the terminal\nhelp - Display available commands</pre>';
        } else if (command === 'logout') {
            // Simulate a logout command (you can implement your logout logic here)
            terminalOutput.innerHTML += '<div class="prompt">$-root: logout</div>';
            terminalOutput.innerHTML += '<pre>Logging out...</pre>';
            fetch('/logout', {
                method: 'GET', // Use the appropriate HTTP method (POST or GET) for your logout endpoint
                // You may need to include headers or credentials if required by your logout endpoint
            })
            .then(response => {
                if (response.ok) {
                    // Successful logout response
                    terminalOutput.innerHTML += '<pre>Logout successful.</pre>';
                    // Redirect to index.html after a short delay (e.g., 2 seconds)
                    setTimeout(() => {
                        window.location.href = ''; // Replace 'index.html' with the desired URL
                    }, 200);
                } else {
                    // Handle logout failure or errors
                    terminalOutput.innerHTML += '<pre>Logout failed.</pre>';
                }
            })
            .catch(error => {
                // Handle network errors or fetch-related issues
                terminalOutput.innerHTML += `<pre>Error: ${error.message}</pre>`;
            });
            
            
            
        } else {
            terminalOutput.innerHTML += '<div class="prompt">$-root: ' + command + '</div>';
            terminalOutput.innerHTML += '<pre>Command not recognized.</pre>';
            
        }
        commandInput.value = '';
    }
});
