# Loyalty Wallet Widget

A simple, embeddable loyalty wallet widget that enables organizations to integrate Apple Wallet and Google Wallet functionality into their websites with just one line of code.

## 🚀 Features

- **📱 Apple Wallet Integration** - Generate QR codes for Apple Wallet
- **🤖 Google Wallet Integration** - Generate QR codes for Google Wallet
- **🎨 Beautiful UI** - Modern, responsive design
- **⚡ Zero Configuration** - Works out of the box with just a script tag
- **🔒 Secure** - Uses JWT tokens and iframe isolation
- **📦 Lightweight** - Single JavaScript file, no dependencies

## 🚀 Quick Start

Add this single line to your HTML:

```html
<script
  src="https://your-domain.com/loyalty-wallet-widget-with-auth.js?orgId=YOUR_ORG_ID"
  type="text/javascript"
  crossorigin="anonymous"
  async="true"
  defer="true"
></script>
```

**That's it!** The widget will automatically:

1. ✅ Authenticate with the backend
2. ✅ Appear in the bottom-right corner
3. ✅ Enable Apple/Google Wallet buttons
4. ✅ Generate QR codes when clicked

## 📖 Integration Guide

### Step 1: Get Your Organization ID

Contact your backend team to get your unique `orgId`.

### Step 2: Add the Script Tag

Place the script tag before the closing `</body>` tag:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Your Website</title>
  </head>
  <body>
    <!-- Your website content -->

    <!-- Loyalty Wallet Widget -->
    <script
      src="https://your-domain.com/loyalty-wallet-widget-with-auth.js?orgId=123"
      type="text/javascript"
      crossorigin="anonymous"
      async="true"
      defer="true"
    ></script>
  </body>
</html>
```

### Step 3: Test the Integration

1. Open your website
2. Look for the widget in the bottom-right corner
3. Click "Add to Apple Wallet" or "Add to Google Wallet"
4. Scan the generated QR code with your mobile device

## 🎨 Widget Appearance

The widget features:

- **Position**: Bottom-right corner of the page
- **Size**: 350px × 500px
- **Design**: Orange gradient background with modern UI
- **Buttons**: Apple Wallet (black) and Google Wallet (blue)
- **QR Code**: Generated dynamically when buttons are clicked

## 🛠 Development

### Setup

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd loyalty-wallet-widget

# Install dependencies
npm install

# Start development server
npm run dev
```

### Testing

1. Start the dev server: `npm run dev`
2. Open: `http://localhost:8080/example-integration.html`
3. The widget should appear and work automatically

## 🚀 Deployment

### Static Hosting (Recommended)

Deploy the `public/` folder to any static hosting service:

- **Netlify**: Drag and drop the `public/` folder
- **Vercel**: Connect your GitHub repo
- **GitHub Pages**: Enable Pages in repository settings

### CDN

Upload `loyalty-wallet-widget-with-auth.js` to a CDN and update the script src:

```html
<script src="https://cdn.your-domain.com/loyalty-wallet-widget-with-auth.js?orgId=123"></script>
```

## 🔍 Troubleshooting

### Widget Not Appearing

**Solutions**:

- ✅ Check browser console for errors
- ✅ Verify script URL is correct
- ✅ Ensure `orgId` parameter is included
- ✅ Check if the page is served over HTTPS

### QR Code Generation Fails

**Solutions**:

- ✅ Check browser console for error details
- ✅ Verify API endpoint accessibility
- ✅ Ensure proper authentication

### CORS Issues

**Solutions**:

- ✅ Serve the widget from the same domain
- ✅ Configure CORS headers on your API
- ✅ Use a CDN for the widget script

## 📁 Files

- `loyalty-wallet-widget-with-auth.js` - Main widget script
- `example-integration.html` - Integration documentation and demo
- `try-with-auth.html` - Simple test file

## 📞 Support

For technical support:

1. Check the browser console for error messages
2. Review this documentation for common solutions
3. Test with the example file to verify functionality

## Demo
https://loyalty-wallet-widget-script.vercel.app/example-integration.html

**Made with ❤️ for seamless loyalty wallet integration**
