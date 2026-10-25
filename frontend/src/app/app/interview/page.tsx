'use client';

import { MockInterviewRoom } from '@/components/interview/MockInterviewRoom';
import { VoiceMentor } from '@/components/mentor/VoiceMentor';

export default function InterviewPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      <MockInterviewRoom />
      <VoiceMentor />
    </div>
  );
}
