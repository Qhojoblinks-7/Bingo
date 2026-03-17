import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '@/components/BinGoHeader';
import { useAppTheme } from '@/hooks/useThemeContext';

// Mock chat messages
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Hello! Welcome to BinGo Support. How can I help you today?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    text: 'Hi, I have a question about my pickup schedule.',
    sender: 'user',
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: '3',
    text: 'Of course! I\'d be happy to help. Could you please provide your pickup ID or the address?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 3400000),
  },
];

// Quick reply options
const QUICK_REPLIES = [
  'Pickup Issue',
  'Payment Help',
  'Account Support',
  'Other',
];

export default function Chat() {
  const { isDark } = useAppTheme();
  
  const colors = isDark ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    muted: '#A0A0A0',
    primary: '#10B981',
    white: '#FFFFFF',
    border: '#333333',
    inputBg: '#2A2A2A',
  } : {
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    muted: '#6B7280',
    primary: '#10B981',
    white: '#FFFFFF',
    border: '#E5E7EB',
    inputBg: '#F3F4F6',
  };

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const agentResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. A support agent will respond shortly. For urgent matters, you can also call us at +233 30 000 0000.',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 2000);
  };

  const handleQuickReply = (reply) => {
    const newMessage = {
      id: Date.now().toString(),
      text: reply,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    
    // Simulate agent response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = {
        'Pickup Issue': 'I understand you have a pickup issue. Could you please describe what\'s happening? Is the bin not being collected on time, or is there a problem with the pickup location?',
        'Payment Help': 'I\'d be happy to help with your payment. Are you having trouble making a payment, or is there an issue with your wallet balance?',
        'Account Support': 'Sure, I can help with your account. What specific aspect would you like assistance with?',
        'Other': 'Thank you for reaching out. Please describe your issue in detail and I\'ll do my best to help.',
      };
      
      const agentResponse = {
        id: (Date.now() + 1).toString(),
        text: responses[reply] || 'Thank you for your message. How can I assist you further?',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.agentMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.agentAvatar}>
            <Ionicons name="headset" size={16} color={colors.white} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.agentBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.agentText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isUser ? styles.userTime : styles.agentTime
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    chatContainer: {
      flex: 1,
    },
    messagesList: {
      padding: 16,
      paddingBottom: 8,
    },
    welcomeBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4',
      padding: 10,
      borderRadius: 12,
      marginBottom: 16,
    },
    welcomeText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    messageContainer: {
      flexDirection: 'row',
      marginBottom: 12,
      maxWidth: '80%',
    },
    userMessageContainer: {
      alignSelf: 'flex-end',
    },
    agentMessageContainer: {
      alignSelf: 'flex-start',
    },
    agentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    messageBubble: {
      padding: 12,
      borderRadius: 16,
      maxWidth: '100%',
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    agentBubble: {
      backgroundColor: colors.card,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    messageText: {
      fontSize: 15,
      lineHeight: 20,
    },
    userText: {
      color: colors.white,
    },
    agentText: {
      color: colors.text,
    },
    messageTime: {
      fontSize: 10,
      marginTop: 4,
    },
    userTime: {
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'right',
    },
    agentTime: {
      color: colors.muted,
    },
    typingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 4,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.muted,
    },
    quickReplies: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    },
    quickReplyBtn: {
      backgroundColor: colors.card,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    quickReplyText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 12,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 10,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: colors.inputBg,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      minHeight: 44,
      maxHeight: 100,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      maxHeight: 80,
    },
    attachBtn: {
      padding: 4,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendBtnDisabled: {
      backgroundColor: colors.border,
    },
  }), [colors, isDark]);

  return (
    <View style={styles.container}>
      <BinGoHeader 
        title="Live Chat" 
        showBack 
        subtitle="Support Team"
      />

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListHeaderComponent={
            <View style={styles.welcomeBanner}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={styles.welcomeText}>
                Secure connection • Typically responds in 2-5 minutes
              </Text>
            </View>
          }
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                <View style={styles.agentAvatar}>
                  <Ionicons name="headset" size={16} color={colors.white} />
                </View>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick Replies */}
        {messages.length <= 3 && (
          <View style={styles.quickReplies}>
            {QUICK_REPLIES.map((reply) => (
              <Pressable
                key={reply}
                style={styles.quickReplyBtn}
                onPress={() => handleQuickReply(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={500}
            />
            <Pressable style={styles.attachBtn}>
              <Ionicons name="attach" size={20} color={colors.muted} />
            </Pressable>
          </View>
          <Pressable 
            style={[
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? colors.white : colors.muted} 
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
