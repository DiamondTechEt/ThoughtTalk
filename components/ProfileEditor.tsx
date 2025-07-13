import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';

interface ProfileEditorProps {
  visible: boolean;
  user: any;
  onClose: () => void;
}

export function ProfileEditor({ visible, user, onClose }: ProfileEditorProps) {
  const colorScheme = useColorScheme();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const styles = createStyles(colorScheme);

  useEffect(() => {
    if (visible && user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
    }
  }, [visible, user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // TODO: Implement profile update API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      Alert.alert('Success', 'Profile updated successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    const hasChanges = displayName !== (user?.displayName || '') || bio !== (user?.bio || '');
    
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onClose },
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
              <X size={24} color={colorScheme === 'dark' ? '#FFFFFF' : '#111827'} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Edit Profile</Text>
            
            <TouchableOpacity
              style={[
                styles.headerButton,
                styles.saveButton,
                isSaving && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Check
                size={24}
                color={isSaving ? (colorScheme === 'dark' ? '#6B7280' : '#9CA3AF') : '#3B82F6'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your display name"
                placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                maxLength={50}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell others about yourself..."
                placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                multiline
                maxLength={160}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {bio.length}/160
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#FFFFFF',
    },
    keyboardContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#E5E7EB',
    },
    headerButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButton: {
      // Additional styling can be added here if needed
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    form: {
      flex: 1,
      padding: 16,
    },
    field: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#D1D5DB',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    },
    bioInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    characterCount: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'right',
      marginTop: 4,
    },
  });
}