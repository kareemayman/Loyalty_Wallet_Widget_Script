const scriptName = "loyalty-wallet-widget.1.js"
let height = window.innerHeight
let width = window.innerWidth

;(() => {
  const script = document.currentScript

  const loadWidget = () => {
    const iframe = document.createElement("iframe")
    iframe.setAttribute("id", "loyalty-wallet-widget")
    const iframeStyle = iframe.style
    iframeStyle.boxSizing = "borderBox"
    iframeStyle.position = "fixed"
    iframeStyle.right = "20px"
    iframeStyle.bottom = "20px"
    iframeStyle.width = "350px"
    iframeStyle.height = "500px"
    iframeStyle.border = "0"
    iframeStyle.margin = "0"
    iframeStyle.padding = "0"
    iframeStyle.zIndex = "999999"
    iframeStyle.borderRadius = "12px"
    iframeStyle.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)"
    iframeStyle.display = "none"

    const messageTypes = {
      init: "init",
      dimensions: "dimensions",
      org: "org",
      invalidOrg: "invalidOrg",
      setParentStyle: "setParentStyle",
      resetParentStyle: "resetParentStyle",
      floatingWidgetStyle: "floatingWidgetStyle",
      resetFloatingWidgetStyle: "resetFloatingWidgetStyle",
      changeFloatingWidgetWidth: "changeFloatingWidgetWidth",
      generateQR: "generateQR",
      qrGenerated: "qrGenerated",
      error: "error",
      requestToken: "requestToken",
      setToken: "setToken",
    }

    const originUrl = script.getAttribute("src").split(scriptName)[0]
    console.log(originUrl)
    const nasnavApi = "https://api.dev.meetusvr.com/"
    const yeshteryApi = "https://api-yeshtery.dev.meetusvr.com/v1/"

    const checkOrgId = (orgId) => {
      if (!orgId) {
        throw new Error("orgId is required")
      } else {
        // Create the widget HTML content
        const widgetHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Loyalty Wallet</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%);
                height: 100vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
              }
              
              .widget-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: 20px;
                color: #333;
              }
              
              .header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
              }
              
              .wallet-icon {
                width: 24px;
                height: 24px;
                margin-right: 12px;
                background: #333;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
              }
              
              .header-text h1 {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin: 0;
              }
              
              .header-text p {
                font-size: 14px;
                color: #666;
                margin: 4px 0 0 0;
              }
              
              .buttons-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
              }
              
              .wallet-button {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                color: white;
              }
              
              .wallet-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              }
              
              .wallet-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
              }
              
              .apple-button {
                background: #000;
              }
              
              .google-button {
                background: #4285f4;
              }
              
              .button-icon {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
              }
              
              .separator {
                height: 1px;
                background: rgba(0, 0, 0, 0.1);
                margin: 20px 0;
              }
              
              .qr-section {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
              }
              
              .qr-placeholder {
                width: 120px;
                height: 120px;
                background: #f0f0f0;
                border: 2px dashed #ccc;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
                color: #999;
                font-size: 12px;
              }
              
              .qr-image {
                width: 120px;
                height: 120px;
                border-radius: 8px;
                margin-bottom: 16px;
              }
              
              .qr-text {
                font-size: 14px;
                color: #666;
                line-height: 1.4;
              }
              
              .loading {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                color: #666;
                font-size: 14px;
              }
              
              .spinner {
                width: 16px;
                height: 16px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #ff6b35;
                border-radius: 50%;
                animation: spin 1s linear infinite;
              }
              
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              .error {
                color: #e74c3c;
                font-size: 14px;
                text-align: center;
                padding: 10px;
                background: rgba(231, 76, 60, 0.1);
                border-radius: 6px;
                margin-top: 10px;
              }
              
              .auth-required {
                text-align: center;
                padding: 20px;
                color: #666;
              }
              
              .auth-required h3 {
                margin-bottom: 10px;
                color: #333;
              }
              
              .auth-required p {
                font-size: 14px;
                line-height: 1.4;
              }
              
              .retry-button {
                background: #ff6b35;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
                font-size: 12px;
              }
              
              .retry-button:hover {
                background: #e55a2b;
              }
            </style>
          </head>
          <body>
            <div class="widget-container">
              <div class="header">
                <div class="wallet-icon">💳</div>
                <div class="header-text">
                  <h1>Loyalty Wallet</h1>
                  <p>Add to your mobile wallet</p>
                </div>
              </div>
              
              <div class="buttons-container">
                <button class="wallet-button apple-button" onclick="generateQR('apple')" id="apple-btn">
                  <div class="button-icon">🍎</div>
                  Add to Apple Wallet
                </button>
                <button class="wallet-button google-button" onclick="generateQR('google')" id="google-btn">
                  <div class="button-icon">📱</div>
                  Add to Google Wallet
                </button>
              </div>
              
              <div class="separator"></div>
              
              <div class="qr-section">
                <div id="qr-container">
                  <div class="qr-placeholder">
                    QR Code
                  </div>
                </div>
                <p class="qr-text">Scan QR code to access your digital loyalty card</p>
              </div>
            </div>
            
            <script>
              let currentToken = null;
              let isLoading = false;
              let isAuthenticating = false;
              
              // Listen for messages from parent (no origin check; accepts messages from any origin)
              window.addEventListener('message', function(event) {
                const data = event.data;
                if (data && data.type === 'setToken') {
                  currentToken = data.token;
                  updateAuthState();
                }
              });
              
              // Try to get token from localStorage or sessionStorage
              function getStoredToken() {
                try {
                  return localStorage.getItem('userToken') || 
                         (localStorage.getItem('userData') ? 
                          JSON.parse(localStorage.getItem('userData'))?.token : null);
                } catch (e) {
                  return null;
                }
              }
              
              // Clear stored tokens
              function clearStoredTokens() {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
                currentToken = null;
              }
              
              // Check if token is expired (basic JWT check)
              function isTokenExpired(token) {
                try {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  const now = Math.floor(Date.now() / 1000);
                  return payload.exp && payload.exp < now;
                } catch (e) {
                  return true; // If we can't parse it, consider it expired
                }
              }
              
              // Authenticate with the backend
              async function authenticate() {
                if (isAuthenticating) return;
                
                isAuthenticating = true;
                showLoading('Authenticating...');
                
                try {
                  const response = await fetch('${yeshteryApi}yeshtery/token', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: "test_user@yopmail.com",
                      password: "abc12345",
                      orgId: "2",
                      isEmployee: false
                    })
                  });
                  
                  if (!response.ok) {
                    throw new Error('Authentication failed: ' + response.status);
                  }
                  
                  const data = await response.json();
                  currentToken = data.accessToken || data.token;
                  
                  // Store token for future use
                  localStorage.setItem('userToken', currentToken);
                  localStorage.setItem('userData', JSON.stringify({
                    token: currentToken,
                    email: "test_user@yopmail.com"
                  }));
                  
                  updateAuthState();
                  isAuthenticating = false;
                  
                } catch (error) {
                  console.error('Authentication error:', error);
                  showError('Authentication failed. Please try again.');
                  isAuthenticating = false;
                }
              }
              
              // Update authentication state
              function updateAuthState() {
                const hasToken = !!currentToken;
                document.getElementById('apple-btn').disabled = !hasToken;
                document.getElementById('google-btn').disabled = !hasToken;
                
                if (!hasToken) {
                  document.getElementById('qr-container').innerHTML = 
                    '<div class="auth-required"><h3>Authentication Required</h3><p>Please log in to generate QR codes for your loyalty wallet.</p><button onclick="authenticate()" class="retry-button">Login</button></div>';
                } else {
                  document.getElementById('qr-container').innerHTML = 
                    '<div class="qr-placeholder">QR Code</div>';
                }
              }
              
              // Initialize token on load
              currentToken = getStoredToken();
              
              // Check if token is expired
              if (currentToken && isTokenExpired(currentToken)) {
                console.log('Token expired, clearing and re-authenticating');
                clearStoredTokens();
                currentToken = null;
              }
              
              if (!currentToken) {
                // Auto-authenticate if no token found
                authenticate();
              } else {
                updateAuthState();
              }
              
              // Request token from parent (target origin = '*')
              window.parent.postMessage({ type: 'requestToken' }, '*');
              
              function generateQR(type) {
                if (isLoading) return;
                
                if (!currentToken) {
                  showError('Authentication required. Please log in first.');
                  return;
                }
                
                // Check if token is expired before making API call
                if (isTokenExpired(currentToken)) {
                  console.log('Token expired, re-authenticating...');
                  clearStoredTokens();
                  authenticate();
                  return;
                }
                
                isLoading = true;
                showLoading('Generating QR code...');
                
                const apiUrl = '${nasnavApi}wallet/' + type + '/qrCode';
                
                fetch(apiUrl, {
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + currentToken,
                  }
                })
                .then(response => {
                  if (!response.ok) {
                    // If 401/403, token might be invalid, try to re-authenticate
                    if (response.status === 401 || response.status === 403) {
                      console.log('API returned 401/403, clearing token and re-authenticating');
                      clearStoredTokens();
                      authenticate();
                      return;
                    }
                    throw new Error('Failed to generate QR code: ' + response.status);
                  }
                  return response.blob();
                })
                .then(blob => {
                  if (blob) {
                    const imgUrl = URL.createObjectURL(blob);
                    showQRCode(imgUrl);
                    isLoading = false;
                  }
                })
                .catch(error => {
                  console.error('Error generating QR code:', error);
                  showError('Failed to generate QR code. Please try again.');
                  isLoading = false;
                });
              }
              
              function showLoading(message = 'Loading...') {
                const container = document.getElementById('qr-container');
                container.innerHTML = '<div class="loading"><div class="spinner"></div>' + message + '</div>';
              }
              
              function showQRCode(imgUrl) {
                const container = document.getElementById('qr-container');
                container.innerHTML = '<img src="' + imgUrl + '" class="qr-image" alt="QR Code">';
              }
              
              function showError(message) {
                const container = document.getElementById('qr-container');
                container.innerHTML = '<div class="error">' + message + '<br><button onclick="authenticate()" class="retry-button">Retry</button></div>';
              }
            </script>
          </body>
          </html>
        `

        // Create blob URL for the iframe content
        const blob = new Blob([widgetHTML], { type: "text/html" })
        const blobUrl = URL.createObjectURL(blob)
        iframe.src = blobUrl

        // Handle messages from iframe (no origin checks; accepts any origin)
        window.addEventListener("message", (event) => {
          let data = event.data
          if (typeof data === "string" || data instanceof String) {
            try {
              data = JSON.parse(data)
            } catch (e) {
              // ignore invalid JSON from other senders
              return e
            }
          }

          if (!data) return

          if (data.type === messageTypes.invalidOrg) {
            iframeStyle.display = "none"
          } else if (data.type === messageTypes.dimensions) {
            const { width, height } = data.payload
            iframeStyle.width = width
            iframeStyle.height = height
          } else if (data.type === "requestToken") {
            // Try to get token from various sources
            const token =
              localStorage.getItem("userToken") ||
              (localStorage.getItem("userData")
                ? JSON.parse(localStorage.getItem("userData"))?.token
                : null)

            if (token && iframe.contentWindow) {
              // send token to iframe (target origin = '*')
              iframe.contentWindow.postMessage(
                {
                  type: "setToken",
                  token: token,
                },
                "*"
              )
            }
          }

          const firstElement = document.body.getElementsByTagName("div")[0]
          const rootElement = document.getElementById("root")

          if (data?.type === messageTypes?.setParentStyle) {
            document.body.style.overflow = "hidden"
            if (firstElement) {
              firstElement.style.overflow = "hidden"
            }
            if (rootElement) {
              rootElement.style.overflow = "hidden"
            }
          }

          if (data?.type === messageTypes?.resetParentStyle) {
            document.body.style.overflow = "initial"
            if (firstElement) {
              firstElement.style.overflow = "initial"
            }
            if (rootElement) {
              rootElement.style.overflow = "initial"
            }
          }

          if (data?.type === messageTypes?.floatingWidgetStyle) {
            if (iframeStyle) {
              iframeStyle.height = "200px"
              iframeStyle.width = "90px"
              iframeStyle.bottom = "50%"
              iframeStyle.transform = "translateY(50%)"
            }
          }

          if (data?.type === messageTypes?.resetFloatingWidgetStyle) {
            if (iframeStyle) {
              iframeStyle.height = "500px"
              iframeStyle.width = "350px"
              iframeStyle.bottom = "20px"
              iframeStyle.transform = "translateY(0%)"
            }
          }

          if (data?.type === messageTypes?.changeFloatingWidgetWidth) {
            const { width } = data.payload
            if (iframeStyle && width) {
              iframeStyle.width = width
            }
          }
        })

        iframe.addEventListener("load", () => {
          iframeStyle.display = "block"
          // Request token after iframe loads (target origin = '*')
          setTimeout(() => {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage({ type: "requestToken" }, "*")
            }
          }, 100)
        })
      }
    }

    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
    }

    window.addEventListener("resize", () => {
      onResize()
      const message = JSON.stringify({
        type: "windowSize",
        payload: { width, height },
      })
      // send to iframe with target origin = '*'
      const iframeEl = document.getElementById("loyalty-wallet-widget")
      if (iframeEl && iframeEl.contentWindow) {
        iframeEl.contentWindow.postMessage(message, "*")
      }
    })

    try {
      const orgId = script
        .getAttribute("src")
        .split("?")
        .find((param) => param.includes("orgId"))
        .split("=")[1]
      checkOrgId(orgId)
    } catch (e) {
      console.error("Loyalty Wallet Widget Error:", e)
    }

    // append iframe to body (the iframe variable is in loadWidget scope so this runs after creation)
    // make sure to append the iframe only after loadWidget ran successfully
    // (we already append inside loadWidget flow after setting iframe.src)
    document.body.appendChild(document.getElementById("loyalty-wallet-widget") || iframe)
  }

  if (document.readyState === "complete") {
    loadWidget()
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "complete") {
        loadWidget()
      }
    })
  }
})()