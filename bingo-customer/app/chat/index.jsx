import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '@/components/BinGoHeader';
import { useAppTheme } from '@/hooks/useThemeContext';
import { supabase } from '@/lib/supabase';

// Quick reply options
const QUICK_REPLIES = [
  'Pickup Issue',
  'Payment Help',
  'Account Support',
  'Other',
];

export default function Chat() {
  const { isDark } = useAppTheme();
  
  const colors = useMemo(() => isDark ? {
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
  }, [isDark]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

   const fetchMessages = async () => {
    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessages([]);
        return;
      }

      const { data: tickets, error } = await supabase
        .from('support_tickets')
        .select('id, subject, message, status, created_at')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mappedMessages = [];
      
      if (tickets && tickets.length > 0) {
        tickets.forEach((ticket) => {
          mappedMessages.push({
            id: `ticket-${ticket.id}-user`,
            text: ticket.subject || ticket.message,
            sender: 'user',
            timestamp: new Date(ticket.created_at),
            status: ticket.status,
          });
          
          if (ticket.status === 'resolved' || ticket.status === 'closed') {
            mappedMessages.push({
              id: `ticket-${ticket.id}-agent`,
              text: `Thank you for contacting BinGo Support. Your ticket #${ticket.id.slice(0, 8)} has been ${ticket.status}. Is there anything else we can help you with?`,
              sender: 'agent',
              timestamp: new Date(ticket.created_at),
            });
          }
        });
      }

      setMessages(mappedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to send a message');
        return;
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          customer_id: user.id,
          subject: inputText.trim().slice(0, 100),
          message: inputText.trim(),
          status: 'open',
          channel: 'chat',
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage = {
        id: `ticket-${data.id}-user`,
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date(data.created_at),
        status: data.status,
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReply = async (reply) => {
    await handleSendWithText(reply);
  };

  const handleSendWithText = async (text) => {
    if (!text.trim()) return;

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to send a message');
        return;
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          customer_id: user.id,
          subject: text.trim().slice(0, 100),
          message: text.trim(),
          status: 'open',
          channel: 'chat',
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage = {
        id: `ticket-${data.id}-user`,
        text: text.trim(),
        sender: 'user',
        timestamp: new Date(data.created_at),
        status: data.status,
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
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
     emptyState: {
       alignItems: 'center',
       justifyContent: 'center',
       paddingTop: 60,
     },
     emptyText: {
       marginTop: 12,
       fontSize: 14,
       fontWeight: '600',
     },
     emptySubtext: {
       marginTop: 4,
       fontSize: 13,
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
                Secure connection • Support team will respond shortly
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>No messages yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.muted }]}>Start a conversation with our support team</Text>
            </View>
          }
        />

        {/* Quick Replies */}
        {messages.length === 0 && (
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
              (!inputText.trim() || isSending) && styles.sendBtnDisabled
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <View style={styles.typingDot} />
            ) : (
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() ? colors.white : colors.muted} 
              />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
