import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Dashboard Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import AffiliateDashboard from '../screens/affiliate/AffiliateDashboard';
import AssistantDashboard from '../screens/assistant/AssistantDashboard';
import CallCenterDashboard from '../screens/call_center/CallCenterDashboard';
import DriverDashboard from '../screens/driver/DriverDashboard';
import CreateOrderScreen from '../screens/affiliate/CreateOrderScreen';
import ProductListScreen from '../screens/admin/ProductListScreen';
import ProductEditScreen from '../screens/admin/ProductEditScreen';
import OrderDetailsScreen from '../screens/assistant/OrderDetailsScreen';


const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AffiliateStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AffiliateDashboard" component={AffiliateDashboard} />
    <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
  </Stack.Navigator>
);

const AdminStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
    </Stack.Navigator>
  );

const AssistantStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AssistantDashboard" component={AssistantDashboard} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
);


const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={colors.button} />
      </View>
    );
  }

  const renderAppStack = () => {
    switch (user?.role) {
      case 'admin':
        return <Stack.Screen name="AdminStack" component={AdminStack} />;
      case 'affiliate':
        return <Stack.Screen name="AffiliateStack" component={AffiliateStack} />;
      case 'assistant_admin':
        return <Stack.Screen name="AssistantStack" component={AssistantStack} />;
      case 'call_center_agent':
        return <Stack.Screen name="CallCenterDashboard" component={CallCenterDashboard} />;
      case 'driver':
        return <Stack.Screen name="DriverDashboard" component={DriverDashboard} />;
      default:
        return <Stack.Screen name="Auth" component={AuthStack} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? renderAppStack() : <Stack.Screen name="Auth" component={AuthStack} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
