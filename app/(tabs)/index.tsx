import { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getPhotos() {
    if (permissionResponse && permissionResponse.status !== "granted") {
      await requestPermission();
    }
    const fetchedPhotos = await MediaLibrary.getAssetsAsync({
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
      sortBy: [MediaLibrary.SortBy.modificationTime],
    });
    setPhotos(fetchedPhotos.assets);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={getPhotos} title="Get Photos" />
      <ScrollView>
        {photos &&
          photos.map((photo) => (
            <Image source={{ uri: photo.uri }} width={50} height={50} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
  },
  albumAssetsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
