(function () {
  "use strict";

  // const scriptName = "loyalty-wallet-widget.js";
  
  // Get script element and extract orgId
  const script = document.currentScript;
  const scriptSrc = script.getAttribute("src");
  const urlParams = new URLSearchParams(scriptSrc.split("?")[1] || "");
  const orgId = urlParams.get("orgId");

  // Configuration
  const widgetUrl = script.getAttribute("data-widget-url") || "http://localhost:8080";
  const WIDGET_URL = `${widgetUrl}/widget`;
  const WIDGET_WIDTH = "400px";
  const WIDGET_HEIGHT = "450px";

  // Message types for parent-iframe communication
  const messageTypes = {
    init: "init",
    ready: "ready",
    error: "error",
    resize: "resize",
    close: "close",
  };

  if (!orgId) {
    console.error("Loyalty Wallet Widget: orgId parameter is required");
    return;
  }

  // Create widget container
  const createWidget = () => {
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "loyalty-wallet-widget-container";
    widgetContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: ${WIDGET_WIDTH};
      height: ${WIDGET_HEIGHT};
      z-index: 999999;
      border: none;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      overflow: hidden;
      display: none;
      background: white;
    `;

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.id = "loyalty-wallet-widget-iframe";
    iframe.src = `${WIDGET_URL}?orgId=${orgId}`;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
    `;
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("frameborder", "0");

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "×";
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    `;

    // Add hover effects
    closeButton.addEventListener("mouseenter", () => {
      closeButton.style.background = "rgba(0, 0, 0, 0.95)";
      closeButton.style.transform = "scale(1.1)";
    });

    closeButton.addEventListener("mouseleave", () => {
      closeButton.style.background = "rgba(0, 0, 0, 0.8)";
      closeButton.style.transform = "scale(1)";
    });

    closeButton.addEventListener("click", () => {
      widgetContainer.style.display = "none";
    });

    widgetContainer.appendChild(iframe);
    widgetContainer.appendChild(closeButton);

    return { widgetContainer, iframe };
  };

  // Create toggle button
  const createToggleButton = () => {
    const toggleButton = document.createElement("button");
    toggleButton.id = "loyalty-wallet-widget-toggle";
    toggleButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7M3 7L5 21H19L21 7M3 7H21M9 11V17M15 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Loyalty Wallet</span>
    `;
    toggleButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      z-index: 999998;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    `;

    toggleButton.addEventListener("mouseenter", () => {
      toggleButton.style.transform = "scale(1.1)";
    });

    toggleButton.addEventListener("mouseleave", () => {
      toggleButton.style.transform = "scale(1)";
    });

    return toggleButton;
  };

  // Handle iframe messages
  const handleIframeMessage = (event) => {
    // Verify origin for security
    if (event.origin !== new URL(WIDGET_URL).origin) {
      return;
    }

    const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

    switch (data.type) {
      case messageTypes.ready:
        console.log("Loyalty Wallet Widget: Ready");
        break;
      case messageTypes.error:
        console.error("Loyalty Wallet Widget Error:", data.message);
        break;
      case messageTypes.resize:
        if (data.width && data.height) {
          const widgetContainer = document.getElementById("loyalty-wallet-widget-container");
          if (widgetContainer) {
            widgetContainer.style.width = data.width;
            widgetContainer.style.height = data.height;
          }
        }
        break;
    }
  };

  // Initialize widget
  const initWidget = () => {
    // Create toggle button
    const toggleButton = createToggleButton();
    document.body.appendChild(toggleButton);

    // Create widget
    const { widgetContainer, iframe } = createWidget();
    document.body.appendChild(widgetContainer);

    // Add event listeners
    toggleButton.addEventListener("click", () => {
      const isVisible = widgetContainer.style.display !== "none";
      widgetContainer.style.display = isVisible ? "none" : "block";

      if (!isVisible) {
        // Send init message to iframe
        iframe.contentWindow.postMessage(
          {
            type: messageTypes.init,
            orgId: orgId,
          },
          new URL(WIDGET_URL).origin
        );
      }
    });

    // Listen for iframe messages
    window.addEventListener("message", handleIframeMessage);

    // Handle iframe load
    iframe.addEventListener("load", () => {
      console.log("Loyalty Wallet Widget: Loaded");
    });

    // Handle iframe error
    iframe.addEventListener("error", () => {
      console.error("Loyalty Wallet Widget: Failed to load");
    });
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
