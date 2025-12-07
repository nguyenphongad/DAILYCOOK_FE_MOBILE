import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { H2, Paragraph } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { prevStep, resetOnboarding } from '../../../redux/slice/surveySlice';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ButtonComponent from '../../../components/button/ButtonComponent';

// Mock data từ API
const questionsData = [
  {
    "_id": "6909fdde40f85f32a922b240",
    "title": "Bạn có ăn cay được không?",
    "questionType": "radio",
    "isActive": true,
    "isRequired": true,
    "order": 1,
    "options": [
      {
        "value": "option_1",
        "label": "Có",
        "_id": "6909fdde40f85f32a922b241"
      },
      {
        "value": "option_2",
        "label": "Không",
        "_id": "6909fdde40f85f32a922b242"
      }
    ],
    "category": "dietaryPreferences"
  },
  {
    "_id": "6909fe0640f85f32a922b244",
    "title": "Bạn chế độ ăn mặn thế nào?",
    "questionType": "radio",
    "isActive": true,
    "isRequired": true,
    "order": 2,
    "options": [
      {
        "value": "option_1",
        "label": "Mặn vừa",
        "_id": "6909fe0640f85f32a922b245"
      },
      {
        "value": "option_2",
        "label": "Mặn hơn mức bình thường",
        "_id": "6909fe0640f85f32a922b246"
      },
      {
        "value": "option_3",
        "label": "Không ăn mặn",
        "_id": "6909fe0640f85f32a922b247"
      }
    ],
    "category": "dietaryPreferences"
  }
];

export default function QuestionsScreen() {
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Sắp xếp câu hỏi theo order và chỉ lấy câu hỏi active
    const activeQuestions = questionsData
      .filter(q => q.isActive)
      .sort((a, b) => a.order - b.order);
    
    setQuestions(activeQuestions);
  }, []);

  const handleOptionSelect = (questionId, optionValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionValue
    }));
  };

  const isAllRequiredAnswered = () => {
    const requiredQuestions = questions.filter(q => q.isRequired);
    return requiredQuestions.every(q => answers[q._id]);
  };

  const handleComplete = () => {
    if (isAllRequiredAnswered()) {
      console.log('Answers:', answers);
      // TODO: Gửi answers lên API
      dispatch(resetOnboarding());
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const renderRadioQuestion = (question) => {
    const selectedValue = answers[question._id];

    return (
      <View key={question._id} style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionTitle}>
            {question.title}
            {question.isRequired && <Text style={styles.requiredMark}> *</Text>}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option._id}
              style={[
                styles.optionItem,
                selectedValue === option.value && styles.selectedOption
              ]}
              onPress={() => handleOptionSelect(question._id, option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionText,
                  selectedValue === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                
                <View style={[
                  styles.radioButton,
                  selectedValue === option.value && styles.selectedRadioButton
                ]}>
                  {selectedValue === option.value && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderQuestion = (question) => {
    switch (question.questionType) {
      case 'radio':
        return renderRadioQuestion(question);
      // Có thể thêm các type khác như 'checkbox', 'text', 'select'...
      default:
        return renderRadioQuestion(question);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.content}>
        <View style={styles.header}>
          <H2 style={styles.title}>Sở thích ăn uống</H2>
          <Paragraph style={styles.subtitle}>
            Cho chúng tôi biết thêm về sở thích ăn uống của bạn để tạo thực đơn phù hợp nhất
          </Paragraph>
        </View>

        <ScrollView 
          style={styles.questionsScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.questionsContent}
        >
          {questions.map((question) => renderQuestion(question))}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <ButtonComponent
            enableBack={true}
            onBack={handleBack}
            onNext={handleComplete}
            nextText="Hoàn thành"
            disableNext={!isAllRequiredAnswered()}
            nextColor="#35A55E"
          />

          <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
            Bước 6/6
          </Paragraph>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    paddingTop: 20,
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'left',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    lineHeight: 22,
  },
  questionsScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  questionsContent: {
    paddingBottom: 20,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionHeader: {
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 24,
  },
  requiredMark: {
    color: '#E74C3C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
    borderColor: '#35A55E',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#35A55E',
    fontWeight: '600',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    backgroundColor: '#35A55E',
    borderColor: '#35A55E',
  },
  bottomContainer: {
    paddingBottom: 40,
  },
});
