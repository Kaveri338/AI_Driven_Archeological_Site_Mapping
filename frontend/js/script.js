document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = "https://kaveri30-ai-driven-archeological-site-mapping-backend.hf.space";

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

    const messageArea = document.getElementById('message-area');
    let currentUser = null;

    const displayMessage = (message, type = 'info') => {
        if (!messageArea) return;
        messageArea.textContent = message;
        messageArea.className = `card ${type}-message`;
        messageArea.style.display = message ? 'block' : 'none';
        if (message) {
            setTimeout(() => {
                messageArea.style.display = 'none';
                messageArea.textContent = '';
            }, 5000);
        }
    };

    const showAuth = () => {
        authSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        analysisPage.style.display = 'none';
        welcomeMessage.style.display = 'none';
    };

    const showDashboard = (username) => {
        currentUser = username;
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        analysisPage.style.display = 'none';
        welcomeMessage.style.display = 'flex';
        usernameDisplay.textContent = username;
    };

    const showAnalysisPage = (title) => {
        dashboardSection.style.display = 'none';
        analysisPage.style.display = 'block';
        analysisTitle.textContent = title;
        imageInput.value = '';
        previewImage.style.display = 'none';
        uploadButton.disabled = true;
        resultDisplay.innerHTML = '<p>Upload an image to see results.</p>';
    };

    showAuth();
    loginForm.style.display = 'block';
    createAccountForm.style.display = 'none';

    switchToCreateLink.addEventListener('click', e => {
        e.preventDefault();
        loginForm.style.display = 'none';
        createAccountForm.style.display = 'block';
    });

    switchToLoginLink.addEventListener('click', e => {
        e.preventDefault();
        loginForm.style.display = 'block';
        createAccountForm.style.display = 'none';
    });

    loginButton.addEventListener('click', () => {
        const username = loginUsernameInput.value;
        const password = loginPasswordInput.value;
        if (!username || !password) {
            displayMessage('Please enter both username and password.', 'error');
            return;
        }
        displayMessage('Logging in...', 'info');
        setTimeout(() => showDashboard(username), 1000);
    });

    createAccountButton.addEventListener('click', () => {
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
        if (password.length < 6) {
            displayMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        displayMessage('Account created successfully! Please log in.', 'success');
        loginForm.style.display = 'block';
        createAccountForm.style.display = 'none';
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        showAuth();
    });

    vegetationAnalysisBtn.addEventListener('click', () => showAnalysisPage('Vegetation Analysis'));
    soilDetectionBtn.addEventListener('click', () => showAnalysisPage('Soil Detection'));

    imageInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            previewImage.src = ev.target.result;
            previewImage.style.display = 'block';
            uploadButton.disabled = false;
        };
        reader.readAsDataURL(file);
    });

    uploadButton.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (!file) return;

        const endpoint =
            analysisTitle.textContent === 'Vegetation Analysis'
                ? '/analyze-vegetation/'
                : '/detect-soil/';

        const formData = new FormData();
        formData.append('file', file);

        displayMessage('Processing image...', 'info');
        resultDisplay.innerHTML = '<p>Processing image...</p>';

        try {
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Backend error');

            const result = await response.json();

            if (analysisTitle.textContent === 'Vegetation Analysis') {
                resultDisplay.innerHTML = `
                    <h3>Vegetation Analysis</h3>
                    <p>Vegetation %: ${result.vegetation_percentage}</p>
                    <p>Class: ${result.classification}</p>
                    <p>${result.message}</p>
                `;
            } else {
                resultDisplay.innerHTML = `
                    <h3>Soil Detection</h3>
                    <p>Soil Type: ${result.soil_type}</p>
                    <p>Confidence: ${(result.confidence_score * 100).toFixed(0)}%</p>
                    <p>${result.message}</p>
                `;
            }
        } catch (err) {
            displayMessage(err.message, 'error');
            resultDisplay.innerHTML = '<p>Error processing image.</p>';
        }
    });

    backToDashboardBtn.addEventListener('click', () => showDashboard(currentUser));
});
