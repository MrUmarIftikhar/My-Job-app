# My Job App - Professional Career Management Platform

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

A modern mobile application for job seekers to track applications, save opportunities, and manage their career journey.

## ✨ Key Features
- **Bookmark System**: Save and organize job opportunities
- **Application Tracker**: Monitor job application statuses
- **Modern UI**: Clean, intuitive interface with smooth navigation
- **Offline Support**: AsyncStorage for persistent data
- **Context API**: Efficient state management

## 🛠 Tech Stack
- **Frontend**: React Native, Expo Router
- **State Management**: React Context API
- **Navigation**: Expo Router with tab-based navigation
- **Storage**: @react-native-async-storage/async-storage
- **UI Components**: React Native Elements, custom styled components
- **Development**: TypeScript, Expo SDK

## 🚀 Project Structure
```
my-job-app/
├── app/                  # App routes and screens
│   ├── bookmarks/        # Bookmarks functionality
│   ├── jobs/             # Job tracking screens
│   ├── context/          # Global state management
│   └── _layout.js        # Root navigation setup
├── screens/              # Legacy screens (being migrated)
├── utils/                # Utility functions
└── package.json          # Project dependencies
```

## 🔧 Development Workflow
1. **Setup**:
   ```bash
   git clone https://github.com/MrUmarIftikhar/My-Job-app.git
   cd My-Job-app
   npm install
   ```

2. **Running the App**:
   ```bash
   npm start
   ```
   - Scan QR code with Expo Go app
   - Or run on simulator: press `i` (iOS) or `a` (Android)

3. **Key Implementation Details**:
   - Implemented custom BookmarkContext for global state
   - Created responsive layouts with React Native StyleSheet
   - Optimized navigation with Expo Router
   - Used TypeScript for type safety

## 📈 Future Improvements
- [ ] Implement user authentication
- [ ] Add push notifications
- [ ] Dark mode support




---
✨ **Crafted with care by Umar Iftikhar
📧 Contact: umarkb2879@gmail.com
