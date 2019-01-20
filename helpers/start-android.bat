
start "adb for connected device emulation" adbForDeviceEmulator.bat
timeout /t 3
start "react-native run-android" run-android.bat
start "react-native log-android" log-android.bat

