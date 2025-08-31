# Building the Android App

Follow these instructions to build the Android application on your local machine.

## Prerequisites

- **Node.js and npm:** Make sure you have a recent version of Node.js and npm installed. You can download them from [https://nodejs.org/](https://nodejs.org/).
- **Android Studio:** You will need Android Studio to build the final APK. You can download it from [https://developer.android.com/studio](https://developer.android.com/studio).
- **Java Development Kit (JDK):** Android Studio requires a JDK. You can use the one that comes with Android Studio or install one separately.

## Step 1: Install Dependencies

Open a terminal in the root of the project and run the following command to install the necessary dependencies:

```bash
npm install
```

## Step 2: Build the Web App

Next, build the React web application by running the following command:

```bash
npm run build
```

This will create a `dist` directory with the production-ready web assets.

## Step 3: Sync the Web App with the Android Project

Now, sync the web assets with the native Android project using the Capacitor CLI:

```bash
npx cap sync android
```

This command will copy the contents of the `dist` directory into the `android/app/src/main/assets/public` directory.

## Step 4: Open the Project in Android Studio

Open the native Android project in Android Studio using the following command:

```bash
npx cap open android
```

This will launch Android Studio and open the `android` directory as a project.

## Step 5: Generate a Release APK

To generate a release APK, you will need to create a signing key. You can do this from within Android Studio by following these steps:

1.  Go to **Build > Generate Signed Bundle / APK...**.
2.  Select **APK** and click **Next**.
3.  Click the **Create new...** button to create a new keystore.
4.  Fill out the form with your information. This will generate a `.jks` file.
5.  Once you have the keystore, you will need to provide the passwords to the build process. The `build.gradle` file is configured to read these from environment variables. You will need to set the following environment variables:
    - `KEYSTORE_PASSWORD`: The password for your keystore.
    - `KEY_PASSWORD`: The password for your key alias.
6.  Once the environment variables are set, you can build the release APK from within Android Studio by going to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

The generated APK will be located in `android/app/build/outputs/apk/release/`. You can then install this APK on an Android device.
