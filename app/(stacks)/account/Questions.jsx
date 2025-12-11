import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { H2, Paragraph } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { prevStep, resetOnboarding } from '../../../redux/slice/surveySlice';
import { 
  getSurveyQuestions, 
  getSurveyResponses, 
  saveSurveyResponses,
  updateSurveyResponses 
} from '../../../redux/thunk/surveyThunk';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ButtonComponent from '../../../components/button/ButtonComponent';

export default function QuestionsScreen() {
  const [answers, setAnswers] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();

  // Lấy data từ Redux store
  const { 
    surveyQuestions, 
    surveyQuestionsLoading, 
    surveyQuestionsError,
    surveyResponses,
    surveyResponsesLoading,
    saveSurveyResponsesLoading,
    updateSurveyResponsesLoading
  } = useSelector((state) => state.survey);

  useEffect(() => {
    // Gọi API để lấy danh sách câu hỏi và câu trả lời cũ (nếu có)
    console.log('🚀 Dispatching getSurveyQuestions...');
    dispatch(getSurveyQuestions());
    
    console.log('🚀 Dispatching getSurveyResponses...');
    dispatch(getSurveyResponses());
  }, [dispatch]);

  // Load câu trả lời cũ vào state nếu có
  useEffect(() => {
    if (surveyResponses && surveyResponses.responses) {
      console.log('📝 Loading existing responses:', surveyResponses.responses);
      
      // Chuyển đổi từ array [{ surveyId, answer }] sang object { questionId: answer }
      const loadedAnswers = {};
      
      if (Array.isArray(surveyResponses.responses)) {
        surveyResponses.responses.forEach(response => {
          if (response.surveyId && response.answer) {
            loadedAnswers[response.surveyId] = response.answer;
          }
        });
      }
      
      console.log('📝 Converted answers to object:', loadedAnswers);
      setAnswers(loadedAnswers);
    }
  }, [surveyResponses]);

  // Thêm log để debug
  useEffect(() => {
    console.log('📋 Survey Questions from Redux:', surveyQuestions);
    console.log('📋 Is Array?', Array.isArray(surveyQuestions));
  }, [surveyQuestions]);

  // Sắp xếp và lọc câu hỏi active - thêm check an toàn
  const questions = Array.isArray(surveyQuestions) 
    ? surveyQuestions
        .filter(q => q.isActive)
        .sort((a, b) => a.order - b.order)
    : [];

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

  const handleComplete = async () => {
    if (isAllRequiredAnswered()) {
      console.log('✅ Submitting Answers:', answers);
      
      try {
        // Format answers theo cấu trúc API yêu cầu: [{ surveyId, answer }]
        const formattedResponses = Object.entries(answers).map(([questionId, answerValue]) => ({
          surveyId: questionId,
          answer: answerValue
        }));
        
        console.log('📤 Formatted responses for API:', formattedResponses);
        
        // Nếu đã có câu trả lời cũ thì update, không thì tạo mới
        if (surveyResponses && surveyResponses._id) {
          console.log('🔄 Updating existing survey response:', surveyResponses._id);
          await dispatch(updateSurveyResponses({
            responseId: surveyResponses._id,
            responses: { responses: formattedResponses }
          })).unwrap();
        } else {
          console.log('💾 Saving new survey response');
          await dispatch(saveSurveyResponses({ 
            responses: formattedResponses 
          })).unwrap();
        }
        
        console.log('✅ Survey saved successfully');
        dispatch(resetOnboarding());
        router.replace('/(tabs)');
      } catch (error) {
        console.error('❌ Error saving survey:', error);
      }
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

  if (surveyQuestionsLoading || surveyResponsesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent />
        <View style={[styles.content, styles.centerContent]}>
          <ActivityIndicator size="large" color="#35A55E" />
          <Text style={styles.loadingText}>
            {surveyQuestionsLoading ? 'Đang tải câu hỏi khảo sát...' : 'Đang tải câu trả lời...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (surveyQuestionsError) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent />
        <View style={[styles.content, styles.centerContent]}>
          <Ionicons name="alert-circle-outline" size={48} color="#E74C3C" />
          <Text style={styles.errorText}>{surveyQuestionsError}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => dispatch(getSurveyQuestions())}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            disableNext={!isAllRequiredAnswered() || saveSurveyResponsesLoading || updateSurveyResponsesLoading}
            nextColor="#35A55E"
            loading={saveSurveyResponsesLoading || updateSurveyResponsesLoading}
          />

          <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
            Bước 6/6 {surveyResponses ? '(Đang chỉnh sửa)' : ''}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#35A55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
