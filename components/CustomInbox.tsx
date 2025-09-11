import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
const CleverTap = require('clevertap-react-native');

interface InboxMessage {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  imageUrl?: string;
}

const CustomInbox = ({onClose}: {onClose: () => void}) => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize the CleverTap App Inbox
    CleverTap.initializeInbox();

    // Fetch the inbox messages
    fetchInboxMessages();

    // Add event listeners for inbox updates
    let allMessagesListener: {remove: () => void};
    let inboxChangedListener: {remove: () => void};

    try {
      allMessagesListener = CleverTap.addListener(
        CleverTap.CleverTapInboxDidInitialize,
        (event: any) => {
          console.log('Inbox initialized', event);
          fetchInboxMessages();
        },
      );

      inboxChangedListener = CleverTap.addListener(
        CleverTap.CleverTapInboxMessagesDidUpdate,
        () => fetchInboxMessages(),
      );
    } catch (error) {
      console.error('Error adding CleverTap listeners:', error);
    }

    // Safe cleanup function
    return () => {
      try {
        if (
          allMessagesListener &&
          typeof allMessagesListener.remove === 'function'
        ) {
          allMessagesListener.remove();
        }
        if (
          inboxChangedListener &&
          typeof inboxChangedListener.remove === 'function'
        ) {
          inboxChangedListener.remove();
        }
      } catch (error) {
        console.error('Error removing CleverTap listeners:', error);
      }
    };
  }, []);

  const fetchInboxMessages = async () => {
    setLoading(true);

    // Get all inbox messages
    CleverTap.getAllInboxMessages((err: any, res: any) => {
      if (!err && res) {
        const formattedMessages = formatMessages(res);
        setMessages(formattedMessages);
      } else {
        console.error('Error fetching inbox messages:', err);
      }
      setLoading(false);
    });

    // Get counts
    CleverTap.getInboxMessageCount((err: any, count: number) => {
      if (!err) setTotalCount(count);
    });

    CleverTap.getInboxMessageUnreadCount((err: any, count: number) => {
      if (!err) setUnreadCount(count);
    });
  };

  const formatMessages = (rawMessages: any[]): InboxMessage[] => {
    if (!rawMessages) return [];

    console.log(rawMessages);

    return rawMessages.map(msg => ({
      id: msg.id || String(Math.random()),
      title: msg.title || 'No Title',
      message: msg.message || 'No Message',
      date: msg.date || new Date().toISOString(),
      isRead: msg.isRead || false,
      imageUrl: msg.imageUrl || undefined,
    }));
  };

  const handleMessagePress = (message: InboxMessage) => {
    // Mark message as read
    CleverTap.markReadInboxMessageForID(message.id);

    // Delete a message (optional)
    CleverTap.deleteInboxMessageForID(message.id);

    // You could also handle custom actions based on message payload here
  };

  const renderMessage = ({item}: {item: InboxMessage}) => (
    <TouchableOpacity
      style={[
        styles.messageCard,
        item.isRead ? styles.readMessage : styles.unreadMessage,
      ]}
      onPress={() => handleMessagePress(item)}>
      {item.imageUrl && (
        <Image source={{uri: item.imageUrl}} style={styles.messageImage} />
      )}
      <View style={styles.messageContent}>
        <Text style={styles.messageTitle}>{item.title}</Text>
        <Text style={styles.messageBody}>{item.message}</Text>
        <Text style={styles.messageDate}>{item.date}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <Text style={styles.headerCount}>
          {unreadCount} unread / {totalCount} total
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : messages.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No messages in your inbox</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerCount: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#0066cc',
    fontWeight: '500',
  },
  messageList: {
    padding: 16,
  },
  messageCard: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readMessage: {
    backgroundColor: '#f9f9f9',
  },
  unreadMessage: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  messageImage: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginBottom: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messageBody: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  messageDate: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0066cc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default CustomInbox;
