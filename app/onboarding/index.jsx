import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

export default function OnboardingIndex() {
  const router = useRouter();
  const { currentStep } = useSelector(state => state.survey);

  useEffect(() => {
    // Điều hướng đến step hiện tại
    switch (currentStep) {
      case 1:
        router.replace('/onboarding/SelectTypeAccount');
        break;
      case 2:
        // Step 2 có thể là FamilyMember (gia đình) hoặc Gender (cá nhân)
        // Mặc định chuyển đến Gender, logic phân nhánh sẽ xử lý trong SelectTypeAccount
        router.replace('/onboarding/Gender');
        break;
      case 3:
        router.replace('/onboarding/Age');
        break;
      case 4:
        router.replace('/onboarding/Height');
        break;
      case 5:
        router.replace('/onboarding/Weight');
        break;
      default:
        router.replace('/onboarding/SelectTypeAccount');
    }
  }, [currentStep]);

  return null;
}
