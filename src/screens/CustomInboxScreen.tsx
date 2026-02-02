import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
const CleverTap = require('clevertap-react-native');

interface InboxMessage {
  id: string;
  date: number;
  expires: number;
  wzrk_id: string;
  _dId: string;
  msg: {
    type: string;
    content: Array<{
      title: {text: string};
      message: {text: string};
      media?: {url: string; content_type: string};
      action?: {
        url: {
          android: {text: string};
          ios: {text: string};
        };
        hasUrl: boolean;
      };
    }>;
  };
  isRead: boolean;
  tags: string[];
}

const CustomInboxScreen: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadInboxMessages();

    // Listen for inbox updates
    const listener = CleverTap.addListener(
      CleverTap.CleverTapInboxDidInitialize,
      () => {
        loadInboxMessages();
      },
    );

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, []);

  const loadInboxMessages = async () => {
    setLoading(true);
    try {
      // Get all inbox messages
      CleverTap.getAllInboxMessages((err: any, messages: InboxMessage[]) => {
        if (err) {
          console.log('Error loading inbox messages:', err);
          setMessages([]);
        } else {
          console.log('Loaded inbox messages:', messages);
          setMessages(messages || []);

          // Calculate unread count
          const unread = messages?.filter(msg => !msg.isRead).length || 0;
          setUnreadCount(unread);
        }
        setLoading(false);
      });
    } catch (error) {
      console.log('Error in loadInboxMessages:', error);
      setLoading(false);
    }
  };

  const markMessageAsRead = (messageId: string) => {
    try {
      CleverTap.markReadInboxMessage(messageId);

      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? {...msg, isRead: true} : msg,
        ),
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

      console.log('Message marked as read:', messageId);
    } catch (error) {
      console.log('Error marking message as read:', error);
    }
  };

  const deleteMessage = (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              CleverTap.deleteInboxMessage(messageId);

              // Update local state
              setMessages(prevMessages =>
                prevMessages.filter(msg => msg.id !== messageId),
              );

              console.log('Message deleted:', messageId);
            } catch (error) {
              console.log('Error deleting message:', error);
            }
          },
        },
      ],
    );
  };

  const handleMessagePress = (message: InboxMessage) => {
    // Mark as read if not already read
    if (!message.isRead) {
      markMessageAsRead(message.id);
    }

    // Handle action URL if exists
    const content = message.msg?.content?.[0];
    if (content?.action?.hasUrl && content.action.url) {
      const url =
        content.action.url.android?.text || content.action.url.ios?.text;
      if (url) {
        // You can implement URL opening logic here
        console.log('Opening URL:', url);
        Alert.alert('Action', `Would open: ${url}`);
      }
    }
  };

  const renderMessage = ({item}: {item: InboxMessage}) => {
    const content = item.msg?.content?.[0];
    const title = content?.title?.text || 'No Title';
    const message = content?.message?.text || 'No Message';
    const mediaUrl = content?.media?.url;

    return (
      <TouchableOpacity
        style={[styles.messageContainer, !item.isRead && styles.unreadMessage]}
        onPress={() => handleMessagePress(item)}>
        {/* Message Header */}
        <View style={styles.messageHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.messageTitle} numberOfLines={1}>
              {title}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteMessage(item.id)}>
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Media if available */}
        {mediaUrl && (
          <Image source={{uri: mediaUrl}} style={styles.messageImage} />
        )}

        {/* Message Content */}
        <Text style={styles.messageText} numberOfLines={3}>
          {message}
        </Text>

        {/* Message Footer */}
        <View style={styles.messageFooter}>
          <Text style={styles.messageDate}>
            {new Date(item.date * 1000).toLocaleDateString()}
          </Text>

          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>📪</Text>
      <Text style={styles.emptyStateTitle}>No Messages</Text>
      <Text style={styles.emptyStateSubtitle}>
        Your inbox is empty. New messages will appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadInboxMessages} />
        }
        contentContainerStyle={
          messages.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  unreadBadge: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageDate: {
    fontSize: 12,
    color: '#999',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E8F4F8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 5,
  },
  tagText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CustomInboxScreen;
