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
  Linking,
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

// Separate component for message item to fix hook issue
const MessageItem: React.FC<{
  item: InboxMessage;
  onPress: (message: InboxMessage) => void;
  onDelete: (messageId: string) => void;
}> = ({item, onPress, onDelete}) => {
  const content = item.msg?.content?.[0];
  const title = content?.title?.text || 'No Title';
  const message = content?.message?.text || 'No Message';
  const mediaUrl = content?.media?.url;

  // Mark as viewed when component mounts
  useEffect(() => {
    try {
      CleverTap.pushInboxNotificationViewedEventForId(item.id);
      console.log('Message viewed event sent:', item.id);
    } catch (error) {
      console.log('Error marking message as viewed:', error);
    }
  }, [item.id]);

  return (
    <TouchableOpacity
      style={[styles.messageContainer, !item.isRead && styles.unreadMessage]}
      onPress={() => onPress(item)}>
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
          onPress={e => {
            e.stopPropagation(); // Prevent message press
            onDelete(item.id);
          }}>
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

interface CustomInboxScreenProps {
  onBack?: () => void;
}

const CustomInboxScreen: React.FC<CustomInboxScreenProps> = ({onBack}) => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadInboxMessages();

    // Listen for inbox initialization
    const initListener = CleverTap.addListener(
      CleverTap.CleverTapInboxDidInitialize,
      (event: any) => {
        console.log('CleverTap Inbox Initialized:', event);
        loadInboxMessages();
      },
    );

    // Listen for inbox messages updates
    const updateListener = CleverTap.addListener(
      CleverTap.CleverTapInboxMessagesDidUpdate,
      (event: any) => {
        console.log('CleverTap Inbox Messages Updated:', event);
        _handleCleverTapInbox('CleverTapInboxMessagesDidUpdate', event);
        // Automatically reload messages when inbox updates
        loadInboxMessages();
      },
    );

    return () => {
      if (initListener) {
        initListener.remove();
      }
      if (updateListener) {
        updateListener.remove();
      }
    };
  }, []);

  // Handle CleverTap inbox events
  const _handleCleverTapInbox = (eventName: string, event: any) => {
    console.log('CleverTap Inbox Event - ', eventName, event);

    // You can add custom logic here based on the event
    switch (eventName) {
      case 'CleverTapInboxMessagesDidUpdate':
        console.log('Inbox messages were updated, refreshing...');
        // The loadInboxMessages() call above will handle the refresh
        break;
      default:
        console.log('Unknown inbox event:', eventName);
    }
  };

  const loadInboxMessages = async () => {
    setLoading(true);
    try {
      // Get all inbox messages first
      CleverTap.getAllInboxMessages((err: any, messages: InboxMessage[]) => {
        if (err) {
          console.log('Error loading inbox messages:', err);
          setMessages([]);
        } else {
          console.log('Loaded inbox messages:', messages?.length || 0);
          const sortedMessages = (messages || []).sort(
            (a, b) => b.date - a.date,
          );
          setMessages(sortedMessages);

          // Calculate unread count from the messages
          const unread = sortedMessages.filter(msg => !msg.isRead).length;
          setUnreadCount(unread);
        }
        setLoading(false);
      });

      // Also get  unread count as backup
      CleverTap.getInboxMessageUnreadCount((err: any, unreadCount: number) => {
        if (!err && unreadCount >= 0) {
          console.log('unread count:', unreadCount);
          // Use count if it's different from calculated count
          setUnreadCount(unreadCount);
        }
      });
    } catch (error) {
      console.log('Error in loadInboxMessages:', error);
      setLoading(false);
    }
  };

  const markMessageAsRead = (messageId: string) => {
    try {
      CleverTap.markReadInboxMessageForId(
        messageId,
        (err: any, result: any) => {
          if (err) {
            console.log('Error marking message as read:', err);
          } else {
            console.log('Message marked as read successfully:', messageId);

            // Update local state immediately for better UX
            setMessages(prevMessages => {
              const updatedMessages = prevMessages.map(msg =>
                msg.id === messageId ? {...msg, isRead: true} : msg,
              );

              // Update unread count
              const newUnreadCount = updatedMessages.filter(
                msg => !msg.isRead,
              ).length;
              setUnreadCount(newUnreadCount);

              return updatedMessages;
            });

            // Note: The CleverTapInboxMessagesDidUpdate listener will trigger
            // and automatically refresh the messages from server
          }
        },
      );
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
              CleverTap.deleteInboxMessageForId(
                messageId,
                (err: any, result: any) => {
                  if (err) {
                    console.log('Error deleting message:', err);
                    Alert.alert('Error', 'Failed to delete message');
                  } else {
                    console.log('Message deleted successfully:', messageId);

                    // Update local state immediately for better UX
                    setMessages(prevMessages => {
                      // Find the message being deleted to check if it was unread
                      const messageToDelete = prevMessages.find(
                        msg => msg.id === messageId,
                      );
                      const updatedMessages = prevMessages.filter(
                        msg => msg.id !== messageId,
                      );

                      // Update unread count if deleted message was unread
                      if (messageToDelete && !messageToDelete.isRead) {
                        setUnreadCount(prev => Math.max(0, prev - 1));
                      }

                      return updatedMessages;
                    });

                    // Note: The CleverTapInboxMessagesDidUpdate listener will trigger
                    // and automatically refresh the messages from server
                  }
                },
              );
            } catch (error) {
              console.log('Error deleting message:', error);
              Alert.alert('Error', 'Failed to delete message');
            }
          },
        },
      ],
    );
  };

  const markAllAsRead = () => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all messages as read?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Mark All',
          onPress: () => {
            const unreadMessages = messages.filter(msg => !msg.isRead);

            if (unreadMessages.length === 0) {
              Alert.alert('Info', 'No unread messages to mark');
              return;
            }

            // Mark all unread messages as read
            unreadMessages.forEach(message => {
              markMessageAsRead(message.id);
            });
          },
        },
      ],
    );
  };

  const handleMessagePress = (message: InboxMessage) => {
    // Use the correct CleverTap method for tracking clicks
    CleverTap.pushInboxNotificationClickedEventForId(message.id);

    // Also record a custom event
    CleverTap.recordEvent('Inbox Message Clicked', {
      messageId: message.id,
      wzrk_id: message.wzrk_id,
    });

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
        console.log('Opening URL:', url);
        Alert.alert('Open Link', `Do you want to open this link?\n${url}`, [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Open',
            onPress: () => {
              Linking.openURL(url).catch(err =>
                console.log('Error opening URL:', err),
              );
            },
          },
        ]);
      }
    }
  };

  const renderMessage = ({item}: {item: InboxMessage}) => (
    <MessageItem
      item={item}
      onPress={handleMessagePress}
      onDelete={deleteMessage}
    />
  );

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
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Inbox</Text>

        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}

          {messages.length > 0 && unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={markAllAsRead}>
              <Text style={styles.markAllText}>Mark All</Text>
            </TouchableOpacity>
          )}
        </View>
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
          messages.length === 0 ? styles.emptyContainer : {paddingBottom: 20}
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
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  markAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
    padding: 8,
    marginRight: -8,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 18,
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
