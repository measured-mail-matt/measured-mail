document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = document.getElementById('submit-button');
    const messageBox = document.getElementById('form-message');
    // NOTE: We added form-fields ID to the HTML to make this work correctly
    const formFields = document.getElementById('form-fields');
    
    // 1. Prepare UI for submission
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('opacity-75');

    // 2. Collect form data
    const data = new FormData(form);
    
    // 3. Send data to Formspree using fetch (AJAX)
    try {
        // *** IMPORTANT: REPLACE THIS URL WITH YOUR ACTUAL FORMSPREE ENDPOINT ID ***
        const formspreeUrl = 'https://formspree.io/f/xyzrdeeg'; 

        const response = await fetch(formspreeUrl, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json' // Crucial for Formspree AJAX confirmation
            }
        });

        if (response.ok) {
            // Success: Hide form fields, show custom message
            // Hide the wrapper div that contains all inputs
            if (formFields) formFields.classList.add('hidden'); 
            submitButton.classList.add('hidden'); // Hide the button itself
            
            messageBox.textContent = 'REQUEST RECEIVED. We will initiate contact within 24 hours to discuss your Measured Mail strategy.';
            messageBox.classList.remove('hidden', 'bg-red-500');
            messageBox.classList.add('bg-success-green');
            form.reset(); // Clear the form internally
        } else {
            // Failure or server error
            const errorData = await response.json();
            let errorMessage = errorData.error ? errorData.error : 'There was a problem submitting your request.';
            
            messageBox.textContent = `Error: ${errorMessage}. Please try again.`;
            messageBox.classList.remove('hidden', 'bg-success-green');
            messageBox.classList.add('bg-red-500');
            
            // Reset button state
            submitButton.textContent = 'SEND INQUIRY';
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-75');
        }

    } catch (error) {
        // Network error
        messageBox.textContent = 'Network Error: Could not connect to the server. Please check your internet connection.';
        messageBox.classList.remove('hidden', 'bg-success-green');
        messageBox.classList.add('bg-red-500');
        
        // Reset button state
        submitButton.textContent = 'SEND INQUIRY';
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-75');
    }
});