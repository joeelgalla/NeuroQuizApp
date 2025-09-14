# NeuroQuiz - Cross-Platform Neuroanatomy Quiz App

## Overview

NeuroQuiz is a mobile-first educational quiz application built with Expo and React Native, designed specifically for medical students to practice neuroanatomy through interactive image-based questions. The app covers three core topics: Dermatomes, Myotomes, and Major Nerves, with an extensible architecture ready for Brain Anatomy content.

The application features a quiz-based learning flow where users select topics, answer multiple-choice questions with visual image options, receive immediate feedback, and track their progress through comprehensive results and spaced review systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54.x for cross-platform development (iOS, Android, Web)
- **Navigation**: Expo Router with file-based routing system using Stack navigation
- **UI Components**: Native React Native components with custom styling
- **State Management**: React Context API for global state (theme, quiz sessions)
- **Responsive Design**: Grid-based layout for image options (2x2 to 3x3) with adaptive sizing

### Component Structure
- **Screens**: Home, Quiz Runner, Results with clean separation of concerns
- **Context Providers**: ThemeProvider for light/dark mode support with persistent settings
- **Services**: ContentService singleton for quiz data management and randomization
- **Types**: Comprehensive TypeScript interfaces for type safety

### Data Architecture
- **Storage**: Local JSON files for quiz content with AsyncStorage for user preferences and missed items
- **Content Model**: Structured quiz items with id, topic, prompt types, options array, explanations, and tags
- **Session Management**: Complete quiz session tracking with answers, timing, and progress
- **Offline-First**: All content bundled locally, no network dependencies required

### Quiz Logic System
- **Randomization**: Shuffled question order and option placement per session
- **Timing**: Dual timer system (30s per question, total session time)
- **Scoring**: Real-time score tracking with accuracy calculations
- **Feedback**: Immediate correct/incorrect responses with explanations
- **Spaced Review**: Failed questions automatically saved for later practice

### Accessibility & UX Features
- **VoiceOver/TalkBack**: Proper alt text and accessibility labels for all interactive elements
- **Haptic Feedback**: Touch feedback on answer selection using Expo Haptics
- **Theme Support**: System-wide light/dark mode with persistent user preference
- **Progress Indicators**: Visual progress bars and question counters
- **High Contrast**: AA-compliant color schemes for better readability

## External Dependencies

### Core Framework
- **Expo SDK 54.x**: Development platform and build system
- **React Native 0.81.4**: Cross-platform mobile framework
- **TypeScript 5.9.2**: Static type checking and development tooling

### Navigation & Routing
- **expo-router 6.x**: File-based navigation system
- **react-native-safe-area-context**: Safe area handling across devices

### Device Integration
- **expo-haptics**: Tactile feedback for user interactions
- **expo-status-bar**: Status bar styling and management
- **expo-constants**: Access to system and app constants

### Storage & Persistence
- **@react-native-async-storage/async-storage**: Local data persistence for user preferences and missed items
- **Local JSON files**: Static content storage for quiz questions and answers

### User Interface
- **react-native-gesture-handler**: Enhanced touch and gesture handling
- **react-native-web**: Web platform compatibility for browser deployment

### Development Tools
- **@types/react**: TypeScript definitions for React components
- **Expo CLI**: Development server and build tools for testing across platforms

### Content Structure
- **Placeholder Images**: Via.placeholder.com URLs for demonstration (designed for easy replacement)
- **Modular JSON Data**: Separate files per topic (dermatomes.json, myotomes.json, major-nerves.json)
- **Extensible Schema**: Ready for additional topics like Brain Anatomy without architectural changes