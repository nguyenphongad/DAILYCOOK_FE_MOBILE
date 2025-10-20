import React from 'react';
import { View, Image, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoadingComponent = ({ visible }) => {
    return (
        <SafeAreaView>
            <Modal visible={visible} transparent={true}>
                <View style={styles.container}>
                    <View style={styles.loadingContainer}>
                        <Image
                            source={require('../../assets/images/loading-icon.gif')}
                            style={styles.loadingImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Nền xám trong suốt
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    loadingImage: {
        width: 220,
        height: 220,
    },
});

export default LoadingComponent;
