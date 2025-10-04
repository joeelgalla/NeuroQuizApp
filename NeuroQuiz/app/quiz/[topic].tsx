import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { ContentService } from '../../services/ContentService';
import { QuizItem, QuizAnswer, QuizSession } from '../../types';
import { imageAssets } from '../../assets/imageAssets';

const { width } = Dimensions.get('window');

export default function QuizScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const contentService = ContentService.getInstance();

  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentItem, setCurrentItem] = useState<QuizItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sessionTime, setSessionTime] = useState(0);

  // Initialize quiz session
  useEffect(() => {
    if (topic) {
      const decodedTopic = decodeURIComponent(topic);
      const items = contentService.getRandomItems(decodedTopic, 10);
      const shuffledItems = items.map(item => contentService.shuffleOptions(item));
      
      const newSession: QuizSession = {
        topic: decodedTopic,
        items: shuffledItems,
        currentIndex: 0,
        score: 0,
        startTime: Date.now(),
        questionStartTime: Date.now(),
        answers: [],
        isComplete: false,
      };
      
      setSession(newSession);
      setCurrentItem(shuffledItems[0] || null);
    }
  }, [topic]);

  // Question timer
  useEffect(() => {
    if (showFeedback || !session || session.isComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.currentIndex, showFeedback]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUp = () => {
    if (currentItem && session) {
      // Auto-select wrong answer when time runs out
      const wrongOption = currentItem.options.find(opt => !opt.isCorrect);
      if (wrongOption) {
        handleOptionSelect(wrongOption.id);
      }
    }
  };

  const handleOptionSelect = async (optionId: string) => {
    if (!currentItem || !session || showFeedback) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const selectedOpt = currentItem.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOpt?.isCorrect || false;
    const timeSpent = Math.round((Date.now() - session.questionStartTime) / 1000);

    const answer: QuizAnswer = {
      itemId: currentItem.id,
      selectedOptionId: optionId,
      isCorrect,
      timeSpent,
    };

    const updatedSession = {
      ...session,
      score: isCorrect ? session.score + 1 : session.score,
      answers: [...session.answers, answer],
    };

    setSession(updatedSession);
    setSelectedOption(optionId);
    setShowFeedback(true);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNext();
    }, 2500);
  };

  const handleNext = () => {
    if (!session) return;

    const nextIndex = session.currentIndex + 1;
    
    if (nextIndex >= session.items.length) {
      // Quiz complete
      const finalSession = {
        ...session,
        currentIndex: nextIndex,
        isComplete: true,
      };
      setSession(finalSession);
      
      // Navigate to results
      router.push({
        pathname: '/results',
        params: {
          score: finalSession.score.toString(),
          total: finalSession.items.length.toString(),
          topic: session.topic,
          sessionData: JSON.stringify(finalSession),
        },
      });
    } else {
      // Next question
      const updatedSession = {
        ...session,
        currentIndex: nextIndex,
        questionStartTime: Date.now(),
      };
      
      setSession(updatedSession);
      setCurrentItem(session.items[nextIndex]);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeLeft(30);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = session && currentItem 
    ? ((session.currentIndex + 1) / session.items.length) * 100 
    : 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      marginBottom: 20,
    },
    topicTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      marginHorizontal: 15,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      width: `${progress}%`,
    },
    progressText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    timerContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    timer: {
      fontSize: 18,
      fontWeight: 'bold',
      color: timeLeft <= 10 ? colors.error : colors.text,
    },
    sessionTimer: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 5,
    },
    promptContainer: {
      backgroundColor: colors.surface,
      padding: 24,
      borderRadius: 16,
      marginBottom: 30,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    promptText: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    optionsContainer: {
      flex: 1,
    },
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    optionCard: {
      width: (width - 50) / 2,
      marginBottom: 18,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      borderWidth: 3,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    optionCardSelected: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
    },
    optionCardCorrect: {
      borderColor: colors.success,
      backgroundColor: colors.success + '15',
      shadowColor: colors.success,
      shadowOpacity: 0.3,
    },
    optionCardWrong: {
      borderColor: colors.error,
      backgroundColor: colors.error + '15',
      shadowColor: colors.error,
      shadowOpacity: 0.3,
    },
    optionImage: {
      width: '100%',
      height: 140,
    },
    optionLabel: {
      padding: 14,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      minHeight: 55,
      backgroundColor: colors.background,
    },
    loadingText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 100,
    },
    explanationContainer: {
      backgroundColor: colors.primary + '10',
      padding: 18,
      borderRadius: 14,
      marginTop: 20,
      borderLeftWidth: 5,
      borderLeftColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 2,
    },
    explanationText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      lineHeight: 26,
    },
  });

  if (!session || !currentItem) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.topicTitle}>{session.topic}</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{session.currentIndex + 1}</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>{session.items.length}</Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <Text style={styles.sessionTimer}>Session: {formatTime(sessionTime)}</Text>
      </View>

      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>
          {currentItem.promptType === 'nerveRoot' && `Nerve Root: ${currentItem.promptValue}`}
          {currentItem.promptType === 'nerve' && `${currentItem.promptValue}`}
          {currentItem.promptType === 'dermatome' && `Dermatome: ${currentItem.promptValue}`}
          {currentItem.promptType === 'myotome' && `Myotome: ${currentItem.promptValue}`}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <View style={styles.optionsGrid}>
          {currentItem.options.map((option) => {
            let cardStyle = [styles.optionCard];
            
            if (showFeedback) {
              if (option.isCorrect) {
                cardStyle.push(styles.optionCardCorrect);
              } else if (option.id === selectedOption) {
                cardStyle.push(styles.optionCardWrong);
              }
            } else if (option.id === selectedOption) {
              cardStyle.push(styles.optionCardSelected);
            }

            const imageSource = imageAssets[option.imageUri as keyof typeof imageAssets] 
              ? imageAssets[option.imageUri as keyof typeof imageAssets]
              : { uri: option.imageUri };

            return (
              <TouchableOpacity
                key={option.id}
                style={cardStyle}
                onPress={() => handleOptionSelect(option.id)}
                disabled={showFeedback}
                activeOpacity={0.8}
              >
                <Image source={imageSource} style={styles.optionImage} />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showFeedback && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>{currentItem.explanation}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}