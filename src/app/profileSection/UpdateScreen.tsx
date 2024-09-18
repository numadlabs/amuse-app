import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native';
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
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useUpdateEmailStore } from '@/lib/store/emailStore';
import OtpInputEmail from '@/components/atom/OtpInputEmail';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import { height } from '@/lib/utils';

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
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const UpdateScreen: React.FC = () => {
  const { screenName, field, value } = useLocalSearchParams<UpdateScreenParams>();
  const [newValue, setNewValue] = useState<string>(value || '');
  const { authState } = useAuth();
  const [date, setDate] = useState<Date>(new Date(value || Date.now()));
  const { email, verificationCode, setEmail, setVerificationCode, reset } = useUpdateEmailStore();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(Platform.OS === 'ios');
  const [showVerificationInput, setShowVerificationInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [otpValue, setOtpValue] = useState<string>('');
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ id: string; name: string } | null>(null);

  const pickerStyle = {
    height: Platform.OS === 'android' ? 100 : 400,
    width: '50%',
    backgroundColor: Platform.OS === 'android' ? Color.Gray.gray200 : Color.Gray.gray600,
    color: Color.Gray.gray100
  };

  const pickerItemStyle = {
    color: 'white', // equivalent to Tailwind's gray-100

    fontSize: 17,
  };
  const { data: countriesData } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });

  const { mutateAsync: sendOtpMutation } = useMutation({
    mutationFn: sendOtp,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log("OTP sent successfully:", data.data.data);
      setShowVerificationInput(true);
    }
  });

  const { mutateAsync: updateEmailMutation } = useMutation({
    mutationFn: updateUserEmail,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log("Email updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: userKeys.info });
      reset();
      router.back();
    }
  });

  useEffect(() => {
    if (countriesData) {
      setCountries(countriesData);
      setFilteredCountries(countriesData);
    }
  }, [countriesData]);

  useEffect(() => {
    if (field === 'dateOfBirth' && value) {
      const initialDate = new Date(value);
      setDate(initialDate > maxDate ? maxDate : initialDate);
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
    try {
      if (field === 'email') {
        if (!showVerificationInput) {
          setLoading(true);
          await sendOtpMutation({ email });
          setLoading(false);
        } else {
          await updateEmailMutation({
            email,
            verificationCode
          });
        }
      } else if (field === 'dateOfBirth') {
        if (date > maxDate) {
          return;
        }
        setLoading(true);
        const dataToUpdate = {
          birthYear: date.getFullYear(),
          birthMonth: date.getMonth() + 1 // Adding 1 because getMonth() returns 0-11
        };
        await updateUserInfo({
          userId: authState.userId,
          data: dataToUpdate
        });
        queryClient.invalidateQueries({ queryKey: userKeys.info });
        setLoading(false);
        router.back();
      } else if (field === 'location') {
        if (!selectedCountry) {
          console.error('No country selected');
          return;
        }
        setLoading(true);
        const dataToUpdate = { countryId: selectedCountry.id };
        await updateUserInfo({
          userId: authState.userId,
          data: dataToUpdate
        });
        queryClient.invalidateQueries({ queryKey: userKeys.info });
        setLoading(false);
        router.back();
      } else {
        setLoading(true);
        const dataToUpdate = { [field]: newValue };
        await updateUserInfo({
          userId: authState.userId,
          data: dataToUpdate
        });
        queryClient.invalidateQueries({ queryKey: userKeys.info });
        setLoading(false);
        router.back();
      }
    } catch (error) {
      console.error('Error updating field:', error);
      setLoading(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    if (currentDate > maxDate) {
      setDate(maxDate);
    } else {
      // Set the day to 1 to ensure we only care about month and year
      const adjustedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      setDate(adjustedDate);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const renderOtpInputs = () => {
    return (
      <Animated.View entering={FadeInLeft.duration(800)} style={styles.otpMainContainer}>
        <Text style={styles.otpTitle}>Verification code</Text>
        <Text style={styles.otpSubtitle}>Sent to {email}</Text>
        <OtpInputEmail length={4} onOtpChange={setOtpValue} />
      </Animated.View>
    );
  };

  const renderInputField = () => {
    if (field === 'email') {
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
    } else if (field === 'dateOfBirth') {
      return (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => {
                  setSelectedMonth(itemValue);
                }}
                style={{
                  height: Platform.OS === 'android' ? 100 : 400,
                  width: '50%',
                  backgroundColor: Platform.OS === 'android' ? Color.Gray.gray600 : Color.Gray.gray600,
                  color: Color.Gray.gray100
                }}
                itemStyle={pickerItemStyle}
              >
                <Picker.Item label="Select a month" value="" />
                {months.map((month) => (
                  <Picker.Item key={month.value} label={month.label} value={month.value} />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => {
                  setSelectedYear(itemValue);

                }}
                style={{
                  height: Platform.OS === 'android' ? 100 : 400,
                  width: '50%',
                  color: Color.Gray.gray100
                }}
                itemStyle={pickerItemStyle}
              >
                <Picker.Item label="Select a year" value="" />
                {years.map((year) => (
                  <Picker.Item key={year} label={year.toString()} value={year} />
                ))}
              </Picker>
            </View>
          )}
        </>
      );
    } else if (field === 'location') {
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
    } else {
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
  dateButton: {
    backgroundColor: Color.Gray.gray500,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateButtonText: {
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
});

export default UpdateScreen;