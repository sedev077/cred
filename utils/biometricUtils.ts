// utils/biometricUtils.ts
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricInfo {
  isAvailable: boolean;
  type: string;
  displayName: string;
  iconName: string;
}

export const getBiometricInfo = async (): Promise<BiometricInfo> => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!hasHardware || !isEnrolled) {
      return {
        isAvailable: false,
        type: 'none',
        displayName: 'Not Available',
        iconName: 'shield-checkmark-outline',
      };
    }

    const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    console.log('Supported auth types:', authTypes);
    console.log('Platform:', Platform.OS);

    // For Android, we can be more specific about what's actually available
    if (Platform.OS === 'android') {
      // On Android, try to determine the primary biometric method
      if (authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return {
          isAvailable: true,
          type: 'fingerprint',
          displayName: 'fingerprint',
          iconName: 'finger-print',
        };
      } else if (authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return {
          isAvailable: true,
          type: 'face',
          displayName: 'face recognition',
          iconName: 'face-outline',
        };
      } else if (authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return {
          isAvailable: true,
          type: 'iris',
          displayName: 'iris',
          iconName: 'eye-outline',
        };
      }
    }

    // For iOS, Face ID vs Touch ID detection
    if (Platform.OS === 'ios') {
      if (authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return {
          isAvailable: true,
          type: 'faceid',
          displayName: 'Face ID',
          iconName: 'face-outline',
        };
      } else if (authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return {
          isAvailable: true,
          type: 'touchid',
          displayName: 'Touch ID',
          iconName: 'finger-print',
        };
      }
    }

    // Fallback - if we have some biometric but can't determine type
    if (authTypes.length > 0) {
      return {
        isAvailable: true,
        type: 'biometric',
        displayName: 'biometric',
        iconName: 'shield-checkmark-outline',
      };
    }

    return {
      isAvailable: false,
      type: 'none',
      displayName: 'Not Available',
      iconName: 'shield-checkmark-outline',
    };

  } catch (error) {
    console.error('Error detecting biometric type:', error);
    return {
      isAvailable: false,
      type: 'error',
      displayName: 'Detection Error',
      iconName: 'shield-checkmark-outline',
    };
  }
};

// Helper function to get the appropriate prompt message
export const getBiometricPromptMessage = (type: string): string => {
  switch (type) {
    case 'fingerprint':
    case 'touchid':
      return 'Place your finger on the sensor to unlock';
    case 'face':
    case 'faceid':
      return 'Look at the camera to unlock with Face ID';
    case 'iris':
      return 'Look at the camera to unlock with iris recognition';
    default:
      return 'Use biometric authentication to unlock';
  }
};