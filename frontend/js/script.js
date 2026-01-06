document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout');

    const authSection = document.getElementById('auth-section');
    const loginForm = document.getElementById('login-form');
    const createAccountForm = document.getElementById('create-account-form');
    const switchToCreateLink = document.getElementById('switch-to-create');
    const switchToLoginLink = document.getElementById('switch-to-login');

    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginButton = document.getElementById('login-button');

    const createUsernameInput = document.getElementById('create-username');
    const createPasswordInput = document.getElementById('create-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const createAccountButton = document.getElementById('create-account-button');

    const dashboardSection = document.getElementById('dashboard-section');
    const vegetationAnalysisBtn = document.getElementById('vegetation-analysis-btn');
    const soilDetectionBtn = document.getElementById('soil-detection-btn');

    const analysisPage = document.getElementById('analysis-page');
    const analysisTitle = document.getElementById('analysis-title');
    const imageInput = document.getElementById('image-input');
    const uploadButton = document.getElementById('upload-button');
    const previewImage = document.getElementById('preview-image');
    const resultDisplay = document.getElementById('result-display');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');

    const messageArea = document.getElementById('message-area'); // New message area

    let currentUser = null; // In a real app, this would be managed by a backend session

    // Helper to display messages
    const displayMessage = (message, type = 'info') => {
        if (messageArea) {
            messageArea.textContent = message;
            messageArea.className = `card ${type}-message`; // Use CSS classes for styling
            messageArea.style.display = 'block';
            setTimeout(() => {
                messageArea.style.display = 'none';
                messageArea.textContent = '';
            }, 5000); // Hide after 5 seconds
        }
    };


    // --- Authentication Logic ---

    const showAuth = () => {
        if (authSection) authSection.style.display = 'block';
        if (dashboardSection) dashboardSection.style.display = 'none';
        if (analysisPage) analysisPage.style.display = 'none';
        if (welcomeMessage) welcomeMessage.style.display = 'none';
        displayMessage('', 'info'); // Clear any previous messages
    };

    const showDashboard = (username) => {
        currentUser = username;
        if (authSection) authSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block';
        if (analysisPage) analysisPage.style.display = 'none';
        if (welcomeMessage) welcomeMessage.style.display = 'flex';
        if (usernameDisplay) usernameDisplay.textContent = username;
        displayMessage('', 'info'); // Clear any previous messages
    };

    const showAnalysisPage = (title) => {
        if (dashboardSection) dashboardSection.style.display = 'none';
        if (analysisPage) analysisPage.style.display = 'block';
        if (analysisTitle) analysisTitle.textContent = title;
        // Reset image input and result display
        if (imageInput) imageInput.value = '';
        if (previewImage) previewImage.style.display = 'none';
        if (previewImage) previewImage.src = '#';
        if (uploadButton) uploadButton.disabled = true;
        if (resultDisplay) resultDisplay.innerHTML = '<p>Upload an image to see results.</p>';
        displayMessage('', 'info'); // Clear any previous messages
    };

    // Initial state
    showAuth();
    if (loginForm) loginForm.style.display = 'block';
    if (createAccountForm) createAccountForm.style.display = 'none';


    if (switchToCreateLink) switchToCreateLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginForm) loginForm.style.display = 'none';
        if (createAccountForm) createAccountForm.style.display = 'block';
        displayMessage('', 'info'); // Clear any previous messages
    });

    if (switchToLoginLink) switchToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginForm) loginForm.style.display = 'block';
        if (createAccountForm) createAccountForm.style.display = 'none';
        displayMessage('', 'info'); // Clear any previous messages
    });

    if (loginButton) loginButton.addEventListener('click', () => {
        const username = loginUsernameInput.value;
        const password = loginPasswordInput.value;
        // Basic client-side validation/dummy login
        if (username && password) {
            displayMessage('Logging in...', 'info');
            // Simulate API call
            setTimeout(() => {
                displayMessage('', 'info'); // Clear message
                showDashboard(username);
                if (loginUsernameInput) loginUsernameInput.value = '';
                if (loginPasswordInput) loginPasswordInput.value = '';
            }, 1000);
        } else {
            displayMessage('Please enter both username and password.', 'error');
        }
    });

    if (createAccountButton) createAccountButton.addEventListener('click', () => {
        const username = createUsernameInput.value;
        const password = createPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!username || !password || !confirmPassword) {
            displayMessage('Please fill in all fields.', 'error');
            return;
        }
        if (password !== confirmPassword) {
            displayMessage('Passwords do not match.', 'error');
            return;
        }
        if (password.length < 6) { // Example constraint
            displayMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        displayMessage(`Creating account for: ${username}...`, 'info');
        // In a real application, you'd send this to a backend for account creation
        setTimeout(() => {
            if (loginForm) loginForm.style.display = 'block';
            if (createAccountForm) createAccountForm.style.display = 'none';
            displayMessage('Account created successfully! Please log in.', 'success');
            if (createUsernameInput) createUsernameInput.value = '';
            if (createPasswordInput) createPasswordInput.value = '';
            if (confirmPasswordInput) confirmPasswordInput.value = '';
        }, 1000);
    });

    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        currentUser = null;
        displayMessage('Logged out.', 'info');
        showAuth();
    });

    // --- Dashboard & Analysis Logic ---

    if (vegetationAnalysisBtn) vegetationAnalysisBtn.addEventListener('click', () => {
        showAnalysisPage('Vegetation Analysis');
    });

    if (soilDetectionBtn) soilDetectionBtn.addEventListener('click', () => {
        showAnalysisPage('Soil Detection');
    });

    if (imageInput) imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (previewImage) previewImage.src = e.target.result;
                if (previewImage) previewImage.style.display = 'block';
                if (uploadButton) uploadButton.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            if (previewImage) previewImage.src = '#';
            if (previewImage) previewImage.style.display = 'none';
            if (uploadButton) uploadButton.disabled = true;
        }
    });

    if (uploadButton) uploadButton.addEventListener('click', () => {
        const file = imageInput.files[0];
        if (file) {
            displayMessage('Processing image...', 'info');
            if (resultDisplay) resultDisplay.innerHTML = '<p>Processing image... (This would send the image to the backend)</p>';
            // Simulate API call
            setTimeout(() => {
                displayMessage('', 'info'); // Clear message
                const analysisType = analysisTitle.textContent;
                let mockResult = '';
                if (analysisType === 'Vegetation Analysis') {
                    mockResult = '<h3>Vegetation Analysis Results:</h3><p>Detected sparse vegetation (30% coverage) with signs of potential historical disturbance. Dominant species: grass, small shrubs.</p>';
                } else if (analysisType === 'Soil Detection') {
                    mockResult = '<h3>Soil Detection Results:</h3><p>Primary soil type: Loamy sand. High iron content detected in the topsoil layer. Potential anomalies: buried features at coordinates X:123, Y:456.</p>';
                }
                if (resultDisplay) resultDisplay.innerHTML = mockResult + '<p>Detailed report available for download.</p>';
            }, 2000);
        } else {
            displayMessage('Please select an image first.', 'error');
        }
    });

    if (backToDashboardBtn) backToDashboardBtn.addEventListener('click', () => {
        showDashboard(currentUser);
    });
});