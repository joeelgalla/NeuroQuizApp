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
      paddingVertical: 20,
      paddingHorizontal: 30,
      borderRadius: 12,
      marginVertical: 10,
      alignItems: 'center',
    },
    topicButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    settingsContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    themeButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeButtonText: {
      color: colors.text,
      fontSize: 16,
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