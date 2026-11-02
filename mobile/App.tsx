import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

type AuthMode = 'login' | 'register';

type PublicReport = {
  _id: string;
  pollutionType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  location: { coordinates: [number, number] };
};

export default function App() {
  const [token, setToken] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [pollutionType, setPollutionType] = useState('PLASTIC_WASTE');
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [reports, setReports] = useState<PublicReport[]>([]);

  const authenticate = async () => {
    setIsBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Authentication failed');
      setToken(result.token);
    } catch (error) {
      Alert.alert('Authentication failed', error instanceof Error ? error.message : 'Try again');
    } finally {
      setIsBusy(false);
    }
  };

  const chooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo-library access to attach pollution evidence.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const captureLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission needed', 'Allow location access to place the report accurately.');
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setLatitude(String(currentLocation.coords.latitude));
    setLongitude(String(currentLocation.coords.longitude));
  };

  const submitReport = async () => {
    if (!image || !latitude || !longitude) {
      Alert.alert('Report incomplete', 'Add an image and capture your location before submitting.');
      return;
    }

    setIsBusy(true);
    try {
      const uploadBody = new FormData();
      uploadBody.append('image', {
        uri: image.uri,
        name: image.fileName || 'pollution-evidence.jpg',
        type: image.mimeType || 'image/jpeg'
      } as unknown as Blob);
      const uploadResponse = await fetch(`${API_URL}/api/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadBody
      });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadResult.error || 'Image upload failed');

      const reportResponse = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: `${API_URL}${uploadResult.imageUrl}`,
          pollutionType,
          userConfirmedType: pollutionType,
          severity,
          description,
          location: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] }
        })
      });
      const reportResult = await reportResponse.json();
      if (!reportResponse.ok) throw new Error(reportResult.error || 'Report submission failed');
      Alert.alert('Report submitted', `Status: ${reportResult.status}`);
      setImage(null);
      setDescription('');
    } catch (error) {
      Alert.alert('Submission failed', error instanceof Error ? error.message : 'Try again');
    } finally {
      setIsBusy(false);
    }
  };

  const loadVerifiedReports = async () => {
    setIsBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/reports/map`);
      if (!response.ok) throw new Error('Unable to load verified reports');
      setReports(await response.json());
      setShowMap(true);
    } catch (error) {
      Alert.alert('Map unavailable', error instanceof Error ? error.message : 'Try again');
    } finally {
      setIsBusy(false);
    }
  };

  if (!token) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.brand}>BlueGuard</Text>
          <Text style={styles.title}>Marine pollution reporting</Text>
          <Text style={styles.subtitle}>Capture evidence, locate it, and send it for verification.</Text>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#7390a3" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#7390a3" secureTextEntry value={password} onChangeText={setPassword} />
          {isBusy ? <ActivityIndicator color="#0c8c9e" /> : <Button title={authMode === 'login' ? 'Sign in' : 'Register'} onPress={authenticate} color="#0c8c9e" />}
          <View style={styles.switchRow}>
            <Button title={`Switch to ${authMode === 'login' ? 'register' : 'login'}`} onPress={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} color="#446273" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>BlueGuard</Text>
        <Text style={styles.title}>Report pollution</Text>
        <Text style={styles.subtitle}>AI assistance is not available until a trained model is evaluated.</Text>
        <Button title={image ? 'Replace evidence image' : 'Choose evidence image'} onPress={chooseImage} color="#0c8c9e" />
        {image && <Image source={{ uri: image.uri }} style={styles.preview} />}
        <Button title="Use current GPS location" onPress={captureLocation} color="#0c8c9e" />
        <TextInput style={styles.input} placeholder="Latitude" placeholderTextColor="#7390a3" keyboardType="numeric" value={latitude} onChangeText={setLatitude} />
        <TextInput style={styles.input} placeholder="Longitude" placeholderTextColor="#7390a3" keyboardType="numeric" value={longitude} onChangeText={setLongitude} />
        <TextInput style={styles.input} placeholder="Pollution type (e.g. PLASTIC_WASTE)" placeholderTextColor="#7390a3" value={pollutionType} onChangeText={setPollutionType} />
        <TextInput style={styles.input} placeholder="Severity: LOW, MEDIUM, or HIGH" placeholderTextColor="#7390a3" value={severity} onChangeText={setSeverity} autoCapitalize="characters" />
        <TextInput style={[styles.input, styles.multiline]} placeholder="Describe what you found" placeholderTextColor="#7390a3" value={description} onChangeText={setDescription} multiline maxLength={2000} />
        {isBusy ? <ActivityIndicator color="#0c8c9e" /> : <Button title="Submit report" onPress={submitReport} color="#0c8c9e" />}
        <Button title="View verified reports" onPress={loadVerifiedReports} color="#0c8c9e" />
        {showMap && (
          <MapView style={styles.map} initialRegion={{ latitude: 20, longitude: 0, latitudeDelta: 80, longitudeDelta: 80 }}>
            {reports.map((report) => (
              <Marker
                key={report._id}
                coordinate={{ latitude: report.location.coordinates[1], longitude: report.location.coordinates[0] }}
                title={report.pollutionType}
                description={`Severity: ${report.severity}`}
              />
            ))}
          </MapView>
        )}
        <View style={styles.switchRow}>
          <Button title="Sign out" onPress={() => setToken('')} color="#446273" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef8fa' },
  container: { padding: 24, gap: 16 },
  brand: { color: '#075766', fontSize: 34, fontWeight: '800', marginTop: 18 },
  title: { color: '#12313d', fontSize: 26, fontWeight: '700' },
  subtitle: { color: '#486875', fontSize: 16, lineHeight: 23, marginBottom: 8 },
  input: { backgroundColor: '#ffffff', borderColor: '#b7d4dc', borderWidth: 1, borderRadius: 10, color: '#12313d', padding: 13, fontSize: 16 },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  preview: { width: '100%', height: 220, borderRadius: 12 },
  map: { width: '100%', height: 300, borderRadius: 12 },
  switchRow: { alignItems: 'center', marginTop: 4 }
});
