import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { ContentService } from '../services/ContentService';

export default function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  const contentService = ContentService.getInstance();
  const topics = contentService.getAllTopics();

  const navigateToQuiz = (topic: string) => {
    router.push(`/quiz/${encodeURIComponent(topic)}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    header: {
      alignItems: 'center',
      marginVertical: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
    },
    topicsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    topicButton: {
      backgroundColor: colors.primary,
      paddingVertical: 22,
      paddingHorizontal: 32,
      borderRadius: 16,
      marginVertical: 12,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    topicButtonText: {
      color: 'white',
      fontSize: 19,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    settingsContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    themeButton: {
      backgroundColor: colors.surface,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    themeButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={styles.title}>NeuroQuiz</Text>
        <Text style={styles.subtitle}>Master neuroanatomy with visual quizzes</Text>
      </View>

      <View style={styles.topicsContainer}>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic}
            style={styles.topicButton}
            onPress={() => navigateToQuiz(topic)}
            activeOpacity={0.8}
          >
            <Text style={styles.topicButtonText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Text style={styles.themeButtonText}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}