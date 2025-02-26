import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import { useBluetoothDevice } from "../lib/src";
import { useNavigation } from "@react-navigation/native";

const ScanningScreen = () => {
    const navigation = useNavigation();
    const { isScanning, devices, startScan, stopScan, connectToDevice } = useBluetoothDevice();

    const foundDevices = devices.length > 0;

    return (
        <View style={styles.container}>
            {isScanning ? (
                <>
                    <Text style={{ paddingTop: 30 }}>{foundDevices? "Select a device..." : "Scanning..."}</Text>

                    <View style={styles.deviceContainer}>
                        {foundDevices ? (
                            <FlatList
                                data={devices}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.deviceButton}
                                        onPress={() => {
                                            connectToDevice(item.id).then(() => {
                                                navigation.navigate("Device");
                                            });
                                        }}
                                    >
                                        <Text style={styles.deviceText}>
                                            {item.name || "Unnamed Device"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <Text style={{ paddingTop: 20 }}>
                                No devices found
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={stopScan}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity onPress={startScan} style={styles.scanButton}>
                    <Icon name="search" size={80} color={"rgb(85, 0, 191)"} />
                    <Text style={styles.scanText}>Start Scanning</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scanButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(227, 211, 247)",
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 30,
    },
    scanText: {
        color: "rgb(85, 0, 191)",
        fontSize: 14,
        fontWeight: "600",
        paddingTop: 30,
    },
    cancelButton: {
        position: "absolute",
        bottom: 20,
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        paddingVertical: 20,
        paddingHorizontal: 80,
        borderRadius: 10,
    },
    cancelText: {
        color: "#fff",
        fontWeight: "bold",
    },
    deviceContainer: {
        width: "90%",
        flex: 1,
        paddingTop: 20,
    },
    deviceButton: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        paddingVertical: 16,
        paddingHorizontal: 30,
        marginVertical: 5,
        borderRadius: 10,
        alignItems: "flex-start",
        width: "100%",
    },
    deviceText: {
        fontSize: 16,
        color: "rgb(42, 42, 42)",
        fontWeight: "500",
    },
});

export default ScanningScreen;
