import { resolve } from "node:path";

import dotenv from "dotenv";
import type { ExpoConfig } from "expo/config";

dotenv.config({ path: resolve(__dirname, ".env") });

const APP_ENV = (process.env.APP_ENV ?? process.env.EXPO_PUBLIC_APP_ENV ?? "development") as
  | "development"
  | "staging"
  | "production";

dotenv.config({ path: resolve(__dirname, `.env.${APP_ENV}`), override: true });
dotenv.config({ path: resolve(__dirname, ".env.local"), override: true });

const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME ?? "REACT-NATIVE-EXPO-BASE-SETUP";
const APP_SLUG = process.env.EXPO_PUBLIC_APP_SLUG ?? "react-native-expo-base-setup";
const IOS_BUNDLE_IDENTIFIER =
  process.env.EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER ?? "tech.reifylabs.reactnativeexpobasesetup";
const ANDROID_PACKAGE =
  process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? "tech.reifylabs.reactnativeexpobasesetup";
const SCHEME = process.env.EXPO_PUBLIC_APP_LINKING_SCHEME ?? "reactnativeexpobasesetup";

const config: ExpoConfig = {
  name: APP_NAME,
  slug: APP_SLUG,
  version: process.env.EXPO_PUBLIC_APP_VERSION ?? "1.0.0",
  orientation: "default",
  scheme: SCHEME,
  userInterfaceStyle: "automatic",
  icon: "./assets/images/icon.png",
  ios: {
    supportsTablet: true,
    bundleIdentifier: IOS_BUNDLE_IDENTIFIER,
    icon: "./assets/expo.icon",
    infoPlist: {
      NSCameraUsageDescription:
        "Camera access is used when you capture or scan content inside the app.",
      NSMicrophoneUsageDescription:
        "Microphone access is used when you record audio inside the app.",
      NSPhotoLibraryUsageDescription:
        "Photo library access is used when you choose images or videos.",
      NSLocationWhenInUseUsageDescription:
        "Location is used to provide relevant in-app experiences when you opt in.",
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    package: ANDROID_PACKAGE,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  experiments: {
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        android: {
          image: "./assets/images/splash-icon.png",
          imageWidth: 120,
        },
      },
    ],
    "expo-notifications",
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to use the camera for in-app capture flows.",
        microphonePermission:
          "Allow $(PRODUCT_NAME) to use the microphone for in-app recording flows.",
        recordAudioAndroid: true,
      },
    ],
  ],
  extra: {
    APP_ENV,
    APP_NAME,
    APP_SLUG,
    APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION ?? "1.0.0",
    APP_BUILD_NUMBER: process.env.EXPO_PUBLIC_APP_BUILD_NUMBER ?? "1",
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "",
    API_VERSION: process.env.EXPO_PUBLIC_API_VERSION ?? "v1",
    DEEP_LINK_SCHEME: SCHEME,
    AUTH_USE_HTTP: process.env.EXPO_PUBLIC_AUTH_USE_HTTP !== "false",
    FEATURE_FLAGS: {
      enableExperimentalFeatures: process.env.EXPO_PUBLIC_FEATURE_EXPERIMENTAL === "true",
    },
  },
};

export default config;
