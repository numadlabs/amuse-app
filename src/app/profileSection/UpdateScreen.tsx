import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { sendOtp, updateUserEmail, updateUserInfo } from "@/lib/service/mutationHelper";
import { getCountries } from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";
import { userKeys } from "@/lib/service/keysHelper";
import Color from "@/constants/Color";
import { BODY_1_REGULAR, BODY_2_MEDIUM, BUTTON_48 } from "@/constants/typography";
import Header from '@/components/layout/Header';
import Button from "@/components/ui/Button";
import { useUpdateEmailStore } from '@/lib/store/emailStore';
import OtpInputEmail from '@/components/atom/OtpInputEmail';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';

interface Country {
  id: string;
  name: string;
  alpha3: string;
  countryCode: string;
}

type UpdateScreenParams = {
  screenName: string;
  field: string;
  value: string;
};

const currentYear = new Date().getFullYear();
const minYear = currentYear - 100; // Assuming a maximum age of 100
const maxYear = currentYear - 18; // Ensure users are at least 18 years old
const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const UpdateScreen: React.FC = () => {
  const { screenName, field, value } = useLocalSearchParams<UpdateScreenParams>();
  const [newValue, setNewValue] = useState<string>(value || '');
  const { authState } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(maxYear);
  const { email, verificationCode, setEmail, setVerificationCode, reset } = useUpdateEmailStore();
  const [showVerificationInput, setShowVerificationInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [otpValue, setOtpValue] = useState<string>('');

  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ id: string; name: string } | null>(null);

  const { data: countriesData } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });

  const { mutateAsync: sendOtpMutation } = useMutation({
    mutationFn: sendOtp,
    onSuccess: () => {
      setShowVerificationInput(true);
    },
    onError: (error) => {
      console.error('Error sending OTP:', error);
    },
  });

  const { mutateAsync: updateEmailMutation } = useMutation({
    mutationFn: updateUserEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.info });
      reset();
      router.back();
    },
    onError: (error) => {
      console.error('Error updating email:', error);
    },
  });

  const { mutateAsync: updateUserInfoMutation } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.info });
      router.back();
    },
    onError: (error) => {
      console.error('Error updating user info:', error);
    },
  });

  useEffect(() => {
    if (countriesData) {
      setCountries(countriesData);
      setFilteredCountries(countriesData);
    }
  }, [countriesData]);

  useEffect(() => {
    if (field === 'dateOfBirth' && value) {
      const [year, month] = value.split('-').map(Number);
      if (year >= minYear && year <= maxYear) {
        setSelectedYear(year);
        setSelectedMonth(month);
      } else {
        // If the existing year is out of range, set to the maximum allowed year
        setSelectedYear(maxYear);
        setSelectedMonth(month);
      }
    } else if (field === 'dateOfBirth') {
      // If no value is provided, set to the maximum allowed year
      setSelectedYear(maxYear);
      setSelectedMonth(1); // Default to January
    }
    if (field === 'email') {
      setEmail(value);
    }
    if (field === 'location' && value && countries.length > 0) {
      const country = countries.find(c => c.id === value);
      if (country) {
        setSelectedCountry({ id: country.id, name: country.name });
      }
    }
  }, [field, value, setEmail, countries]);

  useEffect(() => {
    const code = parseInt(otpValue);
    if (!isNaN(code)) {
      setVerificationCode(code);
    }
  }, [otpValue, setVerificationCode]);

  const filterCountries = (text: string) => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      switch (field) {
        case 'email':
          if (!showVerificationInput) {
            await sendOtpMutation({ email });
          } else {
            await updateEmailMutation({ email, verificationCode });
          }
          break;
        case 'dateOfBirth':
          const selectedDate = new Date(selectedYear, selectedMonth - 1);
          const today = new Date();
          const age = today.getFullYear() - selectedDate.getFullYear();
          const monthDiff = today.getMonth() - selectedDate.getMonth();
          
          if (age < 18 || (age === 18 && monthDiff < 0)) {
            Alert.alert("Invalid Date", "You must be at least 18 years old.");
            setLoading(false);
            return;
          }
          
          await updateUserInfoMutation({
            userId: authState.userId,
            data: { birthYear: selectedYear, birthMonth: selectedMonth }
          });
          break;
        case 'location':
          if (!selectedCountry) {
            throw new Error('No country selected');
          }
          await updateUserInfoMutation({
            userId: authState.userId,
            data: { countryId: selectedCountry.id }
          });
          break;
        default:
          await updateUserInfoMutation({
            userId: authState.userId,
            data: { [field]: newValue }
          });
      }
    } catch (error) {
      console.error('Error updating field:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOtpInputs = () => (
    <Animated.View entering={FadeInLeft.duration(800)} style={styles.otpMainContainer}>
      <Text style={styles.otpTitle}>Verification code</Text>
      <Text style={styles.otpSubtitle}>Sent to {email}</Text>
      <OtpInputEmail length={4} onOtpChange={setOtpValue} />
    </Animated.View>
  );

  const renderDateOfBirthPicker = () => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => setSelectedMonth(Number(itemValue))}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {months.map((month) => (
          <Picker.Item key={month.value} label={month.label} value={month.value} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue) => setSelectedYear(Number(itemValue))}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {years.map((year) => (
          <Picker.Item key={year} label={year.toString()} value={year} />
        ))}
      </Picker>
    </View>
  );

  const renderInputField = () => {
    switch (field) {
      case 'email':
        return (
          <>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your new email"
              placeholderTextColor={Color.Gray.gray200}
              keyboardType="email-address"
            />
            {showVerificationInput && renderOtpInputs()}
          </>
        );
      case 'dateOfBirth':
        return renderDateOfBirthPicker();
      case 'location':
        return (
          <View>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowCountryList(!showCountryList)}
            >
              <Text style={styles.inputText}>
                {selectedCountry ? selectedCountry.name : 'Select a country'}
              </Text>
            </TouchableOpacity>
            {showCountryList && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Search countries"
                  placeholderTextColor={Color.Gray.gray200}
                  onChangeText={filterCountries}
                />
                <FlatList
                  data={filteredCountries}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.countryItem}
                      onPress={() => {
                        setSelectedCountry({ id: item.id, name: item.name });
                        setShowCountryList(false);
                      }}
                    >
                      <Text style={styles.countryItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.countryList}
                />
              </>
            )}
          </View>
        );
      default:
        return (
          <TextInput
            style={styles.input}
            value={newValue}
            onChangeText={setNewValue}
            placeholder={`Enter your ${field}`}
            placeholderTextColor={Color.Gray.gray200}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Edit ${screenName}`} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {renderInputField()}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            textStyle="primary"
            size="default"
            onPress={handleSave}
          >
            {loading ? (
              <ActivityIndicator color={Color.base.White} />
            ) : (
              <Text style={{ ...BUTTON_48, color: Color.base.White }}>
                {field === 'email' && !showVerificationInput ? 'Send OTP' : 'Save changes'}
              </Text>
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    backgroundColor: Color.Gray.gray500,
    color: Color.base.White,
    ...BODY_1_REGULAR,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  inputText: {
    color: Color.base.White,
    ...BODY_1_REGULAR,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: Color.Gray.gray600,
  },
  countryList: {
    maxHeight: 200,
    backgroundColor: Color.Gray.gray500,
    borderRadius: 8,
    marginTop: 8,
  },
  countryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Color.Gray.gray400,
  },
  countryItemText: {
    color: Color.base.White,
    ...BODY_2_MEDIUM,
  },
  otpMainContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  otpTitle: {
    color: Color.base.White,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  otpSubtitle: {
    color: Color.Gray.gray200,
    fontSize: 14,
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    height: Platform.OS === 'android' ? 100 : 200,
    backgroundColor: Color.Gray.gray500,
    color: Color.base.White,
  },
  pickerItem: {
    color: Color.base.White,
    fontSize: 17,
  },
});

export default UpdateScreen;