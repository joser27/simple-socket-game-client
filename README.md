
# **Multiplayer Game Frontend**

This repository contains the code for the frontend of a multiplayer game built using **React** and **Socket.IO**. The frontend connects to a backend server to manage real-time communication between players.

## **Features**

- Real-time interaction with the backend using **Socket.IO**.
- Simple game rendering using HTML5 `<canvas>`.
- Modular design with game logic separated into **GameController** and **GameEngine** components.

## **Requirements**

To run this frontend application, you'll need the following:

- **Node.js** (version 14.x or higher)
- **npm** (Node Package Manager, comes with Node.js)
- **React** (already included in the dependencies)
- **Socket.IO Client** (already included in the dependencies)

## **Getting Started**

### **1. Clone the Repository**

First, clone the repository to your local machine:

\`\`\`bash
git clone https://github.com/your-username/your-frontend-repo-name.git
cd your-frontend-repo-name
\`\`\`

### **2. Install Dependencies**

Install the required Node.js packages:

\`\`\`bash
npm install
\`\`\`

This will install the following dependencies:

- **react**: A JavaScript library for building user interfaces.
- **react-dom**: A package that provides DOM-specific methods for React.
- **socket.io-client**: A library for connecting to a Socket.IO server from the client side.

### **3. Configuration**

By default, the frontend is configured to connect to a backend server running on `localhost` at port `5000`. If your backend server is running on a different IP address or port, update the connection URL in the `GamePage` component.

To update the connection:

1. Open `GamePage.js` (or the relevant file).
2. Replace `http://localhost:5000` with your backend server's IP address and port.

\`\`\`javascript
const socket = io("http://your-backend-ip-address:5000");
\`\`\`

### **4. Running the Application**

To start the frontend application, run the following command:

\`\`\`bash
npm run dev
\`\`\`

This will start the development server, and the application will be accessible at:

- **Local Machine:** `http://localhost:3000`
- **Other Devices on Local Network:** `http://your-local-ip-address:3000`

### **5. Accessing the Application**

Once the application is running, you can access it via:

- **Local Machine:** `http://localhost:3000`
- **Other Devices on Local Network:** `http://your-local-ip-address:3000`

### **6. Troubleshooting**

- **CORS Issues:** Ensure that your backend server is configured to accept connections from your frontend's origin, especially if they are running on different domains or ports.
- **Port Conflicts:** If port `3000` is already in use, you can change it by updating the `start` script in the `package.json` file or by running `npm start --port your-port`.

### **7. Additional Setup**

If your backend server's address changes frequently, consider using environment variables to manage the backend URL dynamically.

Example using `.env` file:

1. Create a `.env` file in the root of your project.
2. Add the following line:

\`\`\`env
REACT_APP_BACKEND_URL=http://your-backend-ip-address:5000
\`\`\`
