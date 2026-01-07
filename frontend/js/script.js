document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = "https://kaveri30-ai-driven-archeological-site-mapping-backend.hf.space";

    // ======== Global Elements ========
    const messageArea = document.getElementById('message-area');
    const appContainer = document.getElementById('app-container');

    // ======== Auth Section Elements ========
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

    // ======== App Header / Navigation ========
    const welcomeMessage = document.getElementById('welcome-message');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout');
    const navLinks = document.querySelectorAll('.app-header nav a');

    // ======== Dashboard / Analysis ========
    const dashboardSection = document.getElementById('dashboard-section');
    const vegetationAnalysisBtn = document.getElementById('vegetation-analysis-btn');
    const soilDetectionBtn = document.getElementById('soil-detection-btn');
    const analysisPage = document.getElementById('analysis-page');
    const analysisTitle = document.getElementById('analysis-title');
    const imageInput = document.getElementById('image-input');
    const previewImage = document.getElementById('preview-image');
    const resultDisplay = document.getElementById('result-display');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const ctaButton = document.querySelector('.cta-button');

    let currentUser = null;

    // ======== Utility ========
    const displayMessage = (message, type = 'info') => {
        if (!messageArea) return;
        messageArea.textContent = message;
        messageArea.className = `${type}-message`;
        messageArea.style.display = message ? 'block' : 'none';
        if (message) {
            setTimeout(() => {
                messageArea.style.display = 'none';
                messageArea.textContent = '';
            }, 5000);
        }
    };

    const showAuth = () => {
        authSection.style.display = 'flex';
        appContainer.style.display = 'none';
        welcomeMessage.style.display = 'none';
        loginForm.style.display = 'block';
        createAccountForm.style.display = 'none';
    };

    const showMainApp = (username) => {
        currentUser = username;
        authSection.style.display = 'none';
        appContainer.style.display = 'block';
        welcomeMessage.style.display = 'flex';
        usernameDisplay.textContent = username;
        dashboardSection.style.display = 'block';
        analysisPage.style.display = 'none';
    };

    const showAnalysisPage = (title) => {
        dashboardSection.style.display = 'none';
        analysisPage.style.display = 'block';
        analysisTitle.textContent = title;
        imageInput.value = '';
        previewImage.style.display = 'none';
        resultDisplay.innerHTML = '<p>Select an image to begin analysis.</p>';
    };

    // ======== Central Analysis Function ========
    const performAnalysis = async (file) => {
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Backend error');
            }

            const result = await response.json();

            if (analysisTitle.textContent === 'Vegetation Analysis') {
                resultDisplay.innerHTML = `
                    <h3>Vegetation Analysis</h3>
                    <p>Vegetation %: <strong>${result.vegetation_percentage}%</strong></p>
                    <p>Classification: <strong>${result.classification}</strong></p>
                    <p>${result.message}</p>
                `;
            } else {
                resultDisplay.innerHTML = `
                    <h3>Soil Detection</h3>
                    <p>Soil Type: <strong>${result.soil_type}</strong></p>
                    <p>Confidence: <strong>${(result.confidence_score * 100).toFixed(0)}%</strong></p>
                    <p>${result.message}</p>
                `;
            }

            displayMessage('Analysis complete!', 'success');
        } catch (err) {
            displayMessage(`Error: ${err.message}`, 'error');
            resultDisplay.innerHTML = '<p>Error processing image.</p>';
        }
    };

    // ======== Initial Load ========
    showAuth();

    // ======== Auth Events ========
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
        if (!username) {
            displayMessage('Please enter a username.', 'error');
            return;
        }
        displayMessage('Logging in...', 'info');
        setTimeout(() => showMainApp(username), 1000);
    });

    createAccountButton.addEventListener('click', () => {
        displayMessage('Account created successfully! Please log in.', 'success');
        loginForm.style.display = 'block';
        createAccountForm.style.display = 'none';
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        showAuth();
        loginUsernameInput.value = '';
        loginPasswordInput.value = '';
    });

    // ======== Navigation ========
    vegetationAnalysisBtn.addEventListener('click', () => showAnalysisPage('Vegetation Analysis'));
    soilDetectionBtn.addEventListener('click', () => showAnalysisPage('Soil Detection'));

    ctaButton.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(ctaButton.getAttribute('href'))
            .scrollIntoView({ behavior: 'smooth' });
    });

    // ======== AUTO ANALYZE ON IMAGE SELECT ========
    imageInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) {
            previewImage.style.display = 'none';
            return;
        }

        const reader = new FileReader();
        reader.onload = ev => {
            previewImage.src = ev.target.result;
            previewImage.style.display = 'block';
            performAnalysis(file);
        };
        reader.readAsDataURL(file);
    });

    backToDashboardBtn.addEventListener('click', () => {
        dashboardSection.style.display = 'block';
        analysisPage.style.display = 'none';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href'))
                .scrollIntoView({ behavior: 'smooth' });
        });
    });
});
