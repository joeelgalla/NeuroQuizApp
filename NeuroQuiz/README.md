# NeuroQuiz - Cross-Platform Neuroanatomy Quiz App

A mobile-first quiz application built with Expo and React Native, designed for medical students to practice neuroanatomy through interactive image-based questions.

## Features

- **Three Quiz Topics**: Dermatomes, Myotomes, and Major Nerves
- **Image-Based Multiple Choice**: 4-8 visual options per question
- **Real-Time Feedback**: Immediate correct/incorrect response with explanations
- **Progress Tracking**: Visual progress bar and question counter
- **Dual Timers**: Per-question timer (30s) and session timer
- **Smart Results**: Score, accuracy, completion time, and missed items review
- **Spaced Review**: Failed questions saved for later practice
- **Accessibility**: VoiceOver/TalkBack support with proper alt text
- **Theme Support**: Light/dark mode toggle with persistent settings
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Offline-First**: All content bundled locally for offline use

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- Expo CLI (optional, but recommended)

### Installation

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd NeuroQuiz
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run web      # Web development
   npm run android  # Android (requires Android Studio/device)
   npm run ios      # iOS (requires Xcode/macOS)
   ```

3. **Access the App**
   - **Web**: Open http://localhost:8081 in your browser
   - **Mobile**: Scan QR code with Expo Go app
   - **Simulator**: Use Android Studio or iOS Simulator

## Project Structure

```
NeuroQuiz/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root navigation layout
│   ├── index.tsx          # Home screen
│   ├── quiz/[topic].tsx   # Quiz runner screen
│   └── results.tsx        # Results and review screen
├── components/            # Reusable UI components
├── context/              # React contexts
│   └── ThemeContext.tsx  # Theme and color management
├── data/                 # JSON seed data
│   ├── dermatomes.json   # Dermatome quiz items
│   ├── myotomes.json     # Myotome quiz items
│   └── major-nerves.json # Major nerve quiz items
├── services/             # Business logic
│   └── ContentService.ts # Quiz content management
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Content Management

### Adding New Quiz Items

Quiz items are stored in JSON files in the `data/` directory. Each item follows this structure:

```json
{
  "id": "unique_id",
  "topic": "Dermatomes" | "Myotomes" | "Major Nerves",
  "promptType": "nerveRoot" | "dermatome" | "myotome" | "nerve",
  "promptValue": "C5",
  "options": [
    {
      "id": "option_id",
      "label": "Human readable label",
      "imageUri": "https://image-url-or-local-path",
      "isCorrect": true
    }
  ],
  "explanation": "Brief explanation of the correct answer",
  "tags": ["anatomical", "location", "tags"]
}
```

### Replacing Placeholder Images

The app currently uses placeholder images. To use real medical imagery:

1. **Prepare Images**: Ensure images are properly licensed for educational use
2. **Add to Assets**: Place images in `assets/images/` directory
3. **Update JSON**: Change `imageUri` values to local paths:
   ```json
   "imageUri": "../../assets/images/c5-dermatome.png"
   ```
4. **Optimize**: Keep images under 200KB for better performance

### Adding New Topics

To add a new topic (e.g., "Brain Anatomy"):

1. **Create Data File**: `data/brain-anatomy.json`
2. **Update Types**: Add topic to type definitions in `types/index.ts`
3. **Update ContentService**: Import and include in `ContentService.ts`
4. **Test**: Verify topic appears on home screen

## Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure Project**
   ```bash
   eas build:configure
   ```

3. **Build for Stores**
   ```bash
   eas build --platform ios     # iOS App Store
   eas build --platform android # Google Play Store
   eas build --platform all     # Both platforms
   ```

4. **Submit to Stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

### Web Deployment

The app can be deployed as a Progressive Web App (PWA):

```bash
npm run build:web
# Deploy the generated web-build/ directory to your hosting service
```

Supported hosting platforms:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## Development

### Adding Features

1. **Create Components**: Add reusable components in `components/`
2. **Add Screens**: Create new screens in `app/` using Expo Router
3. **Update Navigation**: Register routes in `app/_layout.tsx`
4. **Test Thoroughly**: Verify on web, iOS, and Android

### Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run unit tests (if configured)
npm test
```

### Architecture Decisions

- **Expo Router**: File-based routing for better developer experience
- **React Context**: Lightweight state management for themes and settings
- **AsyncStorage**: Persistent storage for user preferences and review items
- **TypeScript**: Type safety and better developer experience
- **Offline-First**: All content bundled locally for reliable access

## Analytics Integration

The app includes analytics hooks ready for integration:

```typescript
import { logEvent } from '../utils/analytics';

// Track quiz completion
logEvent('quiz_completed', {
  topic: 'Dermatomes',
  score: 8,
  total: 10,
  duration: 120
});
```

Popular analytics services:
- Google Analytics
- Amplitude
- Mixpanel
- Firebase Analytics

## Accessibility

The app follows WCAG 2.1 AA guidelines:

- **Screen Reader Support**: All images include descriptive alt text
- **High Contrast**: Color combinations meet contrast requirements
- **Touch Targets**: Minimum 44px touch target size
- **Focus Management**: Proper tab order and focus indicators
- **Voice Navigation**: Compatible with voice control systems

## Performance Optimization

- **Image Optimization**: Placeholder images are optimized for web delivery
- **Bundle Splitting**: Code splitting for faster initial load
- **Caching**: Intelligent caching of quiz data and assets
- **Memory Management**: Efficient cleanup of timers and listeners

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start -c`
2. **Type errors**: Run `npm run type-check` to identify issues
3. **Build failures**: Ensure all dependencies are properly installed
4. **Image loading**: Verify image URLs and network connectivity

### Support

For development issues:
1. Check the Expo documentation
2. Review React Native troubleshooting guides
3. Check the GitHub issues for known problems

## License

This project is intended for educational use in medical training environments. Ensure you have proper licensing for any medical imagery used in production.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on all platforms
5. Submit a pull request

---

Built with ❤️ for medical education using Expo and React Native.