import React, {useEffect} from 'react';
import {View, FlatList, Text, TouchableOpacity, Image} from 'react-native';
import {Dimensions} from 'react-native';
import styles from '../styles/appStyles';
import {
  recordDisplayUnitClick,
  markDisplayUnitAsViewed,
  handleActionPress,
} from '../utils/cleverTapEvents';

const {width: screenWidth} = Dimensions.get('window');

interface Props {
  displayUnits: any[];
  carouselIndexes: {[key: string]: number};
  setCarouselIndexes: (indexes: any) => void;
  carouselRefs: React.MutableRefObject<{[key: string]: any}>;
}

const DisplayUnitRenderer: React.FC<Props> = ({
  displayUnits,
  carouselIndexes,
  setCarouselIndexes,
  carouselRefs,
}) => {
  // Auto-scroll effect
  useEffect(() => {
    if (displayUnits.length === 0) return;
    const intervals: NodeJS.Timeout[] = [];

    displayUnits.forEach((displayUnit, displayUnitIndex) => {
      if (displayUnit.content && displayUnit.content.length > 1) {
        const unitId = displayUnit.wzrk_id || `unit_${displayUnitIndex}`;
        const interval = setInterval(() => {
          setCarouselIndexes((prev: any) => {
            const currentIndex = prev[unitId] || 0;
            const nextIndex = (currentIndex + 1) % displayUnit.content.length;
            const carouselRef = carouselRefs.current[unitId];
            if (carouselRef) {
              carouselRef.scrollToIndex({index: nextIndex, animated: true});
            }
            return {...prev, [unitId]: nextIndex};
          });
        }, 3000);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [displayUnits]);

  const renderCarouselItem = (
    {item: contentItem, index: contentIndex}: any,
    unitId: string,
  ) => (
    <TouchableOpacity
      style={styles.carouselItem}
      onPress={() => recordDisplayUnitClick(contentItem, unitId)}>
      <Text style={styles.carouselKeyText}>
        Item {contentIndex + 1} (Key: {contentItem.key})
      </Text>
      {contentItem.media?.url && (
        <Image
          source={{uri: contentItem.media.url}}
          style={styles.carouselImage}
          resizeMode="cover"
        />
      )}
      {contentItem.recommendedText?.text && (
        <Text style={styles.carouselText} numberOfLines={2}>
          {contentItem.recommendedText.text}
        </Text>
      )}
      {contentItem.action?.hasUrl && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleActionPress(contentItem, unitId)}>
          <Text style={styles.actionButtonText}>🏎️ Visit Ferrari</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderDisplayUnit = ({item, index}: {item: any; index: number}) => {
    const unitId = item.wzrk_id || `unit_${index}`;
    const currentCarouselIndex = carouselIndexes[unitId] || 0;

    return (
      <View style={styles.displayUnitContainer}>
        <Text style={styles.displayUnitTitle}>
          Ferrari F1 Carousel {index + 1}
        </Text>
        <View
          style={{
            backgroundColor: '#e8f4f8',
            padding: 10,
            borderRadius: 6,
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 12, color: '#333'}}>
            Type: {item.type || 'carousel'}
          </Text>
          <Text style={{fontSize: 12, color: '#333'}}>ID: {item.wzrk_id}</Text>
        </View>

        {item.content && item.content.length > 0 && (
          <View style={styles.carouselContainer}>
            <FlatList
              ref={ref => {
                carouselRefs.current[unitId] = ref;
              }}
              data={item.content}
              renderItem={({item: contentItem, index: contentIndex}) =>
                renderCarouselItem(
                  {item: contentItem, index: contentIndex},
                  unitId,
                )
              }
              keyExtractor={(_, contentIndex) => `content_${contentIndex}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.paginationContainer}>
              {item.content.map((_: any, dotIndex: number) => (
                <View
                  key={dotIndex}
                  style={[
                    styles.paginationDot,
                    currentCarouselIndex === dotIndex &&
                      styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => markDisplayUnitAsViewed(unitId)}>
          <Text style={styles.viewButtonText}>Mark Carousel as Viewed</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={displayUnits}
      renderItem={renderDisplayUnit}
      keyExtractor={(_, index) => `display_unit_${index}`}
      scrollEnabled={false}
    />
  );
};

export default DisplayUnitRenderer;
