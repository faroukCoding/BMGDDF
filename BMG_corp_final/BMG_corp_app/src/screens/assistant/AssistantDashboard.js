import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import OrderList from '../../components/OrderList'; // Reusable component
import { colors } from '../../theme/colors';

const AssistantDashboard = ({ navigation }) => {
  const layout = useWindowDimensions();
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: t('pending_review') },
    { key: 'confirmed', title: t('confirmed') },
    { key: 'rejected', title: t('rejected') },
  ]);

  const renderScene = SceneMap({
    pending: () => <OrderList status="pending_review" navigation={navigation} />,
    confirmed: () => <OrderList status="confirmed" navigation={navigation} />,
    rejected: () => <OrderList status="rejected" navigation={navigation} />,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.button }}
      style={{ backgroundColor: '#2C2C54' }}
      labelStyle={{ fontWeight: 'bold' }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};

export default AssistantDashboard;
