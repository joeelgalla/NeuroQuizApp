import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { QuizSession, QuizItem } from '../types';

export default function ResultsScreen() {
  const { score, total, topic, sessionData } = useLocalSearchParams<{
    score: string;
    total: string;
    topic: string;
    sessionData: string;
  }>();
  
  const { colors } = useTheme();
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [savedToReview, setSavedToReview] = useState(false);

  useEffect(() => {
    if (sessionData) {
      try {
        const parsedSession = JSON.parse(sessionData) as QuizSession;
        setSession(parsedSession);
        saveMissedItems(parsedSession);
      } catch (error) {
        console.log('Error parsing session data:', error);
      }
    }
  }, [sessionData]);

  const saveMissedItems = async (session: QuizSession) => {
    try {
      const missedItems = session.items.filter((item, index) => {
        const answer = session.answers[index];
        return answer && !answer.isCorrect;
      });

      if (missedItems.length > 0) {
        const existingMissed = await AsyncStorage.getItem('missedItems');
        const allMissed = existingMissed ? JSON.parse(existingMissed) : [];
        
        // Add new missed items, avoiding duplicates
        missedItems.forEach(item => {
          if (!allMissed.some((missed: QuizItem) => missed.id === item.id)) {
            allMissed.push(item);
          }
        });

        await AsyncStorage.setItem('missedItems', JSON.stringify(allMissed));
        setSavedToReview(true);
      }
    } catch (error) {
      console.log('Error saving missed items:', error);
    }
  };

  const calculateAccuracy = (): number => {
    const scoreNum = parseInt(score || '0');
    const totalNum = parseInt(total || '1');
    return Math.round((scoreNum / totalNum) * 100);
  };

  const calculateTotalTime = (): string => {
    if (!session) return '0:00';
    const totalSeconds = Math.round((Date.now() - session.startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = (): { message: string; color: string } => {
    const accuracy = calculateAccuracy();
    if (accuracy >= 90) {
      return { message: 'Excellent! 🎉', color: colors.success };
    } else if (accuracy >= 70) {
      return { message: 'Good job! 👍', color: colors.primary };
    } else if (accuracy >= 50) {
      return { message: 'Keep practicing! 💪', color: colors.warning };
    } else {
      return { message: 'Review and try again! 📚', color: colors.error };
    }
  };

  const getMissedItems = (): QuizItem[] => {
    if (!session) return [];
    return session.items.filter((item, index) => {
      const answer = session.answers[index];
      return answer && !answer.isCorrect;
    });
  };

  const handleRetry = () => {
    router.push(`/quiz/${encodeURIComponent(topic || '')}`);
  };

  const handleReviewMissed = async () => {
    try {
      const missedItems = await AsyncStorage.getItem('missedItems');
      if (missedItems) {
        const items = JSON.parse(missedItems) as QuizItem[];
        if (items.length === 0) {
          Alert.alert('No Items', 'You have no items to review!');
          return;
        }
        // Here you could navigate to a special review mode
        // For now, just show an alert
        Alert.alert('Review Mode', 'Review mode would show your missed items for spaced repetition practice.');
      }
    } catch (error) {
      console.log('Error accessing missed items:', error);
    }
  };

  const performance = getPerformanceMessage();
  const missedItems = getMissedItems();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    topic: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    performanceContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 30,
      marginBottom: 30,
      alignItems: 'center',
    },
    performanceMessage: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    scoreText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.primary,
    },
    totalText: {
      fontSize: 24,
      color: colors.textSecondary,
      marginLeft: 5,
    },
    accuracyText: {
      fontSize: 20,
      color: colors.text,
      marginBottom: 10,
    },
    timeText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statsContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 30,
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
      textAlign: 'center',
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    missedSection: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
    },
    missedItem: {
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    missedQuestion: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 5,
    },
    missedExplanation: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    buttonContainer: {
      gap: 15,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    homeButton: {
      backgroundColor: 'transparent',
      paddingVertical: 15,
      paddingHorizontal: 30,
      alignItems: 'center',
    },
    homeButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Quiz Complete!</Text>
          <Text style={styles.topic}>{topic}</Text>
        </View>

        <View style={styles.performanceContainer}>
          <Text style={[styles.performanceMessage, { color: performance.color }]}>
            {performance.message}
          </Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.totalText}>/{total}</Text>
          </View>
          
          <Text style={styles.accuracyText}>{calculateAccuracy()}% Accuracy</Text>
          <Text style={styles.timeText}>Completed in {calculateTotalTime()}</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Session Statistics</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Questions Answered</Text>
            <Text style={styles.statValue}>{total}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Correct Answers</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Missed Questions</Text>
            <Text style={styles.statValue}>{missedItems.length}</Text>
          </View>
          
          <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.statLabel}>Total Time</Text>
            <Text style={styles.statValue}>{calculateTotalTime()}</Text>
          </View>
        </View>

        {missedItems.length > 0 && (
          <View style={styles.missedSection}>
            <Text style={styles.sectionTitle}>Questions to Review</Text>
            {missedItems.map((item, index) => (
              <View key={item.id} style={styles.missedItem}>
                <Text style={styles.missedQuestion}>
                  {item.promptType === 'nerveRoot' ? `Nerve Root: ${item.promptValue}` : item.promptValue}
                </Text>
                <Text style={styles.missedExplanation}>{item.explanation}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleRetry}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          {savedToReview && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleReviewMissed}>
              <Text style={styles.secondaryButtonText}>Review Missed Items</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}