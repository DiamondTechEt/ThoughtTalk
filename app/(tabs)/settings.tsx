import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Moon, Sun, Monitor, LogOut, Edit3 } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { ProfileEditor } from '@/components/ProfileEditor';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { user, signOut } = useAuth();
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const styles = createStyles(colorScheme);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authPromptText}>Sign in to access settings</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const themeOptions = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <User size={32} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
              </View>
              <View style={styles.profileText}>
                <Text style={styles.displayName}>{user.displayName || 'Anonymous'}</Text>
                <Text style={styles.email}>{user.email}</Text>
                {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowProfileEditor(true)}
            >
              <Edit3 size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeContainer}>
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = option.key === (colorScheme || 'system');
              
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.themeOption,
                    isSelected && styles.themeOptionSelected,
                  ]}
                >
                  <IconComponent
                    size={24}
                    color={isSelected ? '#6366F1' : (colorScheme === 'dark' ? '#E5E7EB' : '#374151')}
                  />
                  <Text style={[
                    styles.themeOptionText,
                    isSelected && styles.themeOptionTextSelected,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ProfileEditor
        visible={showProfileEditor}
        user={user}
        onClose={() => setShowProfileEditor(false)}
      />
    </SafeAreaView>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F9FAFB',
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 12,
    },
    profileCard: {
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatarContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: isDark ? '#2D2D2D' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    profileText: {
      flex: 1,
    },
    displayName: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 4,
    },
    bio: {
      fontSize: 14,
      color: isDark ? '#F9FAFB' : '#111827',
    },
    editButton: {
      padding: 8,
    },
    themeContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    themeOption: {
      flex: 1,
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    themeOptionSelected: {
      borderColor: '#6366F1',
    },
    themeOptionText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 8,
    },
    themeOptionTextSelected: {
      color: '#6366F1',
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      justifyContent: 'center',
    },
    signOutText: {
      color: '#EF4444',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    authPrompt: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    authPromptText: {
      fontSize: 18,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
  });
}