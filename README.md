# 🦄 Unicorn Image Editor

A high-performance, web-based drawing application built with React and Firebase. Unicorn leverages JavaScript Web Workers for enhanced performance and features seamless autosaving to create an uninterrupted creative experience.

**Developed by:** [darthblanc](https://github.com/darthblanc) and [Xavier](https://github.com/j-cow2)

## ✨ Features

- **High-Performance Canvas**: Utilizes JavaScript Web Workers for smooth, responsive drawing operations
- **Automatic Saving**: Intelligent autosave system preserves your work without interruption
- **Firebase Integration**: Cloud-based authentication, storage, and real-time database functionality
- **Modern React Architecture**: Built with Vite for fast development and optimized production builds
- **Responsive Design**: Works seamlessly across different devices and screen sizes

## 🚀 Quick Start

### Prerequisites

Ensure you have Node.js and npm installed on your system:

```bash
sudo apt-get install nodejs
sudo apt-get install npm
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/darthblanc/unicorn-public.git
   cd unicorn-public
   ```

2. **Navigate to the React app directory**
   ```bash
   cd my-react-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install firebase
   ```

### Development Setup

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open in browser**
   - Once Vite loads, press `o` followed by Enter
   - The application will automatically open in your default browser

## 🔥 Firebase Configuration

### Initial Setup

1. **Login to Firebase CLI**
   ```bash
   firebase login
   ```

2. **Initialize Firebase emulators**
   ```bash
   firebase init
   ```
   Follow the prompts to configure:
   - Select emulators you need (Authentication, Firestore, Storage, Functions)
   - Configure hosting settings
   - Set up database rules

3. **Start Firebase emulators**
   ```bash
   firebase emulators:start
   ```

### Configuration File Setup

1. Navigate to the [Firebase Console](https://console.firebase.google.com)
2. Go to Project Settings → General
3. Scroll to "Your apps" section
4. Select "unicorn-web"
5. Copy the configuration object

6. Create the configuration file:
   ```bash
   mkdir my-react-app/hidden
   touch my-react-app/hidden/firebaseConfig.json
   ```

7. Paste the configuration into `firebaseConfig.json` and format as valid JSON:
   ```json
   {
     "apiKey": "your-api-key",
     "authDomain": "your-auth-domain",
     "projectId": "your-project-id",
     "storageBucket": "your-storage-bucket",
     "messagingSenderId": "your-messaging-sender-id",
     "appId": "your-app-id"
   }
   ```

### Managing Emulators

To modify enabled emulators:
- Edit `my-react-app/firebase.json`
- Add or remove emulator configurations as needed

## 📁 Project Structure

```
unicorn-public/
├── my-react-app/         # React frontend application
│   ├── src/              # Source files
│   ├── public/           # Static assets
│   ├── hidden/           # Firebase configuration (gitignored)
│   └── firebase.json     # Firebase emulator configuration
├── node-backend/         # Backend services
└── README.md             # This file
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **JavaScript Web Workers** - Multi-threaded canvas operations

### Backend & Services
- **Firebase Authentication** - User authentication
- **Firestore** - Real-time NoSQL database
- **Firebase Storage** - Cloud file storage
- **Cloud Functions** - Serverless backend logic
- **Node.js** - Backend runtime

## 🎨 Drawing Features

- Canvas-based drawing interface
- Real-time rendering with Web Workers for optimal performance
- Automatic save functionality (saves every minute)
- Cloud synchronization across devices
- User authentication and personalized workspaces

## 🔧 Development

### Running in Development Mode

```bash
cd my-react-app
npm run dev
```

### Building for Production

```bash
npm run build
```

### Testing with Firebase Emulators

```bash
firebase emulators:start
```

Access the emulator UI at the URL provided in the terminal (typically `http://localhost:4000`)

## 📝 Topics & Technologies

- Multithreading with Web Workers
- Progressive Web Application (PWA)
- Firebase Authentication
- Firestore Database
- Firebase Storage
- Cloud Functions
- Modern React Development
- Canvas API

## 🤝 Contributing

This is a public version of the Unicorn Image Editor. Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- **darthblanc** - [GitHub Profile](https://github.com/darthblanc)
- **j-cow2** - [GitHub Profile](https://github.com/j-cow2)

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
- Kill the process using the port or specify a different port in vite.config.js

**Firebase emulator errors:**
- Ensure all required emulators are properly configured in firebase.json
- Check that firebase-tools is up to date: `npm install -g firebase-tools`

**Canvas performance issues:**
- Verify Web Workers are properly initialized
- Check browser console for any worker-related errors
- Ensure your browser supports modern Canvas API features

## 📞 Support

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/darthblanc/unicorn-public/issues)
- Check existing issues for solutions
- Contact the development team

## 🔗 Links

- [Repository](https://github.com/darthblanc/unicorn-public)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
