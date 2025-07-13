import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Copy, ExternalLink, MessageSquare } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

interface ShareModalProps {
  visible: boolean;
  thought: any;
  onClose: () => void;
}

export function ShareModal({ visible, thought, onClose }: ShareModalProps) {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const handleCopyText = async () => {
    try {
      await Clipboard.setStringAsync(thought.content);
      Alert.alert('Copied!', 'Thought copied to clipboard');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to copy text');
    }
  };

  const handleShareExternal = async () => {
    try {
      const shareText = `"${thought.content}" - ${thought.user.displayName} on ThoughtLine`;
      await Share.share({
        message: shareText,
      });
      onClose();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareInApp = () => {
    // For now, just copy the text - in a real app this could share to other users
    Alert.alert(
      'Share in App',
      'In-app sharing feature coming soon! For now, the text has been copied to your clipboard.',
      [{ text: 'OK', onPress: handleCopyText }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Share Thought</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={colorScheme === 'dark' ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
            </View>

            <View style={styles.thoughtPreview}>
              <Text style={styles.thoughtContent} numberOfLines={3}>
                "{thought?.content}"
              </Text>
              <Text style={styles.thoughtAuthor}>
                - {thought?.user?.displayName}
              </Text>
            </View>

            <View style={styles.options}>
              <TouchableOpacity style={styles.option} onPress={handleCopyText}>
                <View style={styles.optionIcon}>
                  <Copy size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Copy Text</Text>
                  <Text style={styles.optionDescription}>Copy thought to clipboard</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={handleShareExternal}>
                <View style={styles.optionIcon}>
                  <ExternalLink size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Share Externally</Text>
                  <Text style={styles.optionDescription}>Share via other apps</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={handleShareInApp}>
                <View style={styles.optionIcon}>
                  <MessageSquare size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Share in App</Text>
                  <Text style={styles.optionDescription}>Share with other users</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: 'transparent',
    },
    modal: {
      backgroundColor: isDark ? '#121212' : '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#2D2D2D' : '#E5E7EB',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    closeButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    thoughtPreview: {
      padding: 20,
      backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB',
      margin: 20,
      borderRadius: 12,
    },
    thoughtContent: {
      fontSize: 16,
      lineHeight: 24,
      color: isDark ? '#F9FAFB' : '#111827',
      fontStyle: 'italic',
      marginBottom: 8,
    },
    thoughtAuthor: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'right',
    },
    options: {
      paddingHorizontal: 20,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    optionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    optionText: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
  });
}