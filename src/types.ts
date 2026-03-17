export type Report = {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  meetingType: string;
  
  // 基本情報
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  meetingMethod: string;
  location: string;
  summary: string;
  
  // 詳細レポート（テキスト形式）
  details: string;
  
  // 以下は旧バージョン（新規商談＆ヒアリング専用）との互換性のために残す
  selfIntro?: string;
  authority?: string;
  solicitationPolicy?: string;
  recommendationReason?: string;
  fdDeclaration?: string;
  privacyPolicy?: string;
  deathBenefit?: string;
  medicalBenefit?: string;
  disabilityBenefit?: string;
  assetFormation?: string;
  existingInsurance?: string;
  specialNotes?: string;
  otherRequests?: string;
};
