import tw from 'twrnc';
import AnimatedHeaderWrapper from '@/components/animated-header-wrapper';
import { useTheme, Text, Appbar } from 'react-native-paper';
import { useSubjectsStore } from '@/data/subjects-store';
import { router } from 'expo-router';

export default function Debug() {
  const theme = useTheme();
  const subjectsStore = useSubjectsStore();

  return (
    <AnimatedHeaderWrapper
      title='Debug info'
      scrollViewProps={{
        style: {
          backgroundColor: theme.colors.background
        },
        contentContainerStyle: tw`px-4 gap-2`
      }}
      leftContent={<Appbar.BackAction onPress={() => router.back()} />}
    >
      <Text>
        {JSON.stringify(subjectsStore.getSubjects(), null, 2)}
      </Text>
    </AnimatedHeaderWrapper>
  )
}
