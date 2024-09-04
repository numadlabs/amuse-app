import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Color from "@/constants/Color";
import { BODY_1_REGULAR, H4, BUTTON_48 } from "@/constants/typography";
import { type ErrorBoundaryProps } from 'expo-router';
import * as Updates from 'expo-updates';

interface ErrorBoundaryComponentProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryComponentProps, ErrorBoundaryState, ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryComponentProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Failed to reload the app:", error);
    }
  }

  render() {
    if (this.state.hasError || !this.props.children) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return this.renderDefaultErrorView();
    }

    return this.props.children;
  }

  renderDefaultErrorView() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Oops! Something went wrong.</Text>
        <Text style={styles.message}>We're sorry for the inconvenience. Please try reloading the app.</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={this.handleReload}>
          <Text style={styles.reloadButtonText}>Reload App</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.Gray.gray600,
    padding: 20,
  },
  heading: {
    ...H4,
    color: Color.base.White,
    marginBottom: 10,
  },
  message: {
    ...BODY_1_REGULAR,
    color: Color.base.White,
    textAlign: 'center',
    marginBottom: 20,
  },
  reloadButton: {
    backgroundColor: Color.Gray.gray300,
    padding: 12,
    borderRadius: 8,
  },
  reloadButtonText: {
    ...BUTTON_48,
    color: Color.base.White,
  },
});

export default ErrorBoundary;