import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendOtp, updateUserEmail, updateUserInfo } from "@/lib/service/mutationHelper";
import { useAuth } from "@/context/AuthContext";
import { userKeys } from "@/lib/service/keysHelper";
import Color from "@/constants/Color";
import { BODY_1_REGULAR, BODY_2_MEDIUM, BUTTON_48 } from "@/constants/typography";
import Header from '@/components/layout/Header';
import Button from "@/components/ui/Button";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useUpdateEmailStore } from '@/lib/store/emailStore';
import OtpInputEmail from '@/components/atom/OtpInputEmail';  // Adjust the import path as needed
import Animated, { FadeInLeft, SlideInDown } from 'react-native-reanimated';

type UpdateScreenParams = {
  screenName: string;
  field: string;
  value: string;
};

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
    if (field === 'dateOfBirth' && value) {
      const initialDate = new Date(value);
      setDate(initialDate > maxDate ? maxDate : initialDate);
    }
    if (field === 'email') {
      setEmail(value);
    }
  }, [field, value, setEmail]);

  useEffect(() => {
    const code = parseInt(otpValue);
    if (!isNaN(code)) {
      setVerificationCode(code);
    }
  }, [otpValue, setVerificationCode]);

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
          [field]: date.toISOString().split('T')[0] 
        };
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
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    if (currentDate > maxDate) {
      setDate(maxDate);
    } else {
      setDate(currentDate);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? "spinner" : "default"}
              onChange={onDateChange}
              maximumDate={maxDate}
            />
          )}
        </>
      );
    } else if (field === 'location') {
      return (
        <GooglePlacesAutocomplete
          placeholder="Area (ex. Prague)"
          onPress={(data, details = null) => {
            setNewValue(data.description);
          }}
          textInputProps={{
            placeholderTextColor: Color.Gray.gray100,
            returnKeyType: "search"
          }}
          query={{
            key: "AIzaSyD6P0kwuwr_7RTb5_2UZLNteryotRLItCM",
            language: "en",
            types: "(regions)"
          }}
          fetchDetails={true}
          onFail={(error) => console.error(error)}
          styles={{
            container: styles.googlePlacesContainer,
            textInput: styles.googlePlacesTextInput,
            listView: styles.googlePlacesListView,
            row: styles.googlePlacesRow,
            poweredContainer: styles.googlePlacesPoweredContainer,
          }}
          renderRow={(rowData) => (
            <Text style={styles.googlePlacesSuggestion}>
              {rowData.description}
            </Text>
          )}
          listViewDisplayed="auto"
          renderDescription={(rowData) => rowData.description}
        />
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
              <ActivityIndicator />
            ) : (
              <Text style={{ ...BUTTON_48 }}>
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
  googlePlacesContainer: {
    flex: 1,
  },
  googlePlacesTextInput: {
    backgroundColor: Color.Gray.gray500,
    color: Color.base.White,
    ...BODY_1_REGULAR,
    padding: 12,
    borderRadius: 8,
  },
  googlePlacesListView: {
    backgroundColor: Color.Gray.gray600,
  },
  googlePlacesRow: {
    backgroundColor: Color.Gray.gray500,
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
  googlePlacesPoweredContainer: {
    display: 'none',
  },
  googlePlacesSuggestion: {
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