# chrome-extension-kidney
Chrome extension to estimate chances of a tumor coming back as non-clear cell for kidney cancer


This extension includes a basic predictor for a kidney cancer to come back as non-clear cell  based on the most common presentations of non-clear cell kidney cancers. This is not meant to be medical advice or diagnostics, it is to be used to increase our confidence in sending out a kit for a tumor that has not been biopsied. 

# Setup
`npm install` then `npm start` will run the build then follow the installation instructions to install and open it while you develop

# Updates
When you make an update to the chrome extension while it's not currently running, you will need to have it run the build so you can upload the latest version. Run `npm start` anytime you need to run the application and rebuild. While running it will hotreload with any updates to the jsx files. 

# Installation
To install the extension:
- Navigate to Chrome Settings -> Extensions
- Turn developer mode on
- Load unpacked extension -> select the build folder
