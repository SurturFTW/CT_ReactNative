const CleverTap = require('clevertap-react-native');

export interface UserProperties {
  Name: string;
  Identity: string;
  Email: string;
  Phone: string;
  Gender: string;
  DOB: Date;
  [key: string]: any;
}

export const loginUser = (userProps: UserProperties) => {
  try {
    CleverTap.onUserLogin(userProps);
    console.log('User logged in successfully');
  } catch (e) {
    console.log('Error during user login:', e);
  }
};

export const logoutUser = () => {
  try {
    CleverTap.logout();
    console.log('User logged out');
  } catch (e) {
    console.log('Error during logout:', e);
  }
};
