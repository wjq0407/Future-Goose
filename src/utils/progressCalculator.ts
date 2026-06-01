import { UserProfile, UserGrade } from '@/types';
import { growthPaths } from '@/data/growthPaths';
import { Conversation } from '@/types';

export interface AutoProgressConfig {
  assessmentWeight: number;
  conversationWeight: number;
  skillWeight: number;
  manualWeight: number;
}

const DEFAULT_CONFIG: AutoProgressConfig = {
  assessmentWeight: 0.25,
  conversationWeight: 0.25,
  skillWeight: 0.25,
  manualWeight: 0.25,
};

function calculateAssessmentScore(profile: UserProfile): number {
  if (!profile.assessmentCompleted) {
    return 0;
  }
  
  const baseScore = profile.assessmentScore / 100;
  
  const directionCount = profile.careerDirection?.length || 0;
  const directionBonus = Math.min(directionCount / 3, 1) * 0.2;
  
  const goalCount = profile.goals?.length || 0;
  const goalBonus = Math.min(goalCount / 3, 1) * 0.15;
  
  const interestCount = profile.interests?.length || 0;
  const interestBonus = Math.min(interestCount / 3, 1) * 0.15;
  
  return Math.min(baseScore + directionBonus + goalBonus + interestBonus, 1);
}

function calculateConversationScore(conversations: Conversation[], grade: UserGrade | null): number {
  if (!grade || !conversations.length) {
    return 0;
  }
  
  const totalMessages = conversations.reduce(
    (sum, conv) => sum + conv.messages.filter(m => m.role === 'user').length,
    0
  );
  
  const depthScore = Math.min(totalMessages / 20, 1);
  
  const sceneCount = new Set(conversations.map(c => c.scene)).size;
  const diversityScore = sceneCount / 3;
  
  return depthScore * 0.6 + diversityScore * 0.4;
}

function calculateSkillScore(profile: UserProfile, grade: UserGrade | null): number {
  if (!grade || !profile.assessmentCompleted) {
    return 0;
  }
  
  const skills = profile.skills || {};
  const skillValues = Object.values(skills);
  
  if (skillValues.length === 0) {
    return 0;
  }
  
  const avgSkill = skillValues.reduce((sum, val) => sum + val, 0) / skillValues.length;
  
  const maxSkill = Math.max(...skillValues);
  const excellenceBonus = maxSkill / 100 * 0.3;
  
  const normalizedAvg = avgSkill / 100;
  
  return Math.min(normalizedAvg + excellenceBonus, 1);
}

function calculateManualScore(profile: UserProfile, grade: UserGrade | null): number {
  if (!grade) {
    return 0;
  }
  
  const path = growthPaths[grade];
  const completedCount = Object.values(profile.milestones).filter(Boolean).length;
  const totalCount = path.milestones.length;
  
  return totalCount > 0 ? completedCount / totalCount : 0;
}

export function calculateAutoProgress(
  profile: UserProfile,
  conversations: Conversation[],
  config: AutoProgressConfig = DEFAULT_CONFIG
): Record<string, boolean> {
  const { grade } = profile;
  
  if (!grade) {
    return {};
  }
  
  const path = growthPaths[grade];
  const milestoneCount = path.milestones.length;
  
  const assessmentScore = calculateAssessmentScore(profile);
  const conversationScore = calculateConversationScore(conversations, grade);
  const skillScore = calculateSkillScore(profile, grade);
  const manualScore = calculateManualScore(profile, grade);
  
  const totalScore = 
    assessmentScore * config.assessmentWeight +
    conversationScore * config.conversationWeight +
    skillScore * config.skillWeight +
    manualScore * config.manualWeight;
  
  const expectedCompleted = Math.round(totalScore * milestoneCount);
  
  const autoCompleted: Record<string, boolean> = { ...profile.milestones };
  
  const sortedMilestones = [...path.milestones].sort((a, b) => {
    const aCompleted = autoCompleted[a.id] ? 1 : 0;
    const bCompleted = autoCompleted[b.id] ? 1 : 0;
    return aCompleted - bCompleted;
  });
  
  let completedCount = Object.values(autoCompleted).filter(Boolean).length;
  
  for (const milestone of sortedMilestones) {
    if (completedCount >= expectedCompleted) {
      break;
    }
    
    if (!autoCompleted[milestone.id]) {
      autoCompleted[milestone.id] = true;
      completedCount++;
    }
  }
  
  return autoCompleted;
}

export function calculateProgressPercentage(
  profile: UserProfile,
  grade: UserGrade | null
): number {
  if (!grade) {
    return 0;
  }
  
  const path = growthPaths[grade];
  const completedCount = Object.values(profile.milestones).filter(Boolean).length;
  const totalCount = path.milestones.length;
  
  return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
}

export function getProgressBreakdown(
  profile: UserProfile,
  conversations: Conversation[]
): Record<string, number> {
  const { grade } = profile;
  
  if (!grade) {
    return {
      assessment: 0,
      conversation: 0,
      skill: 0,
      manual: 0,
      total: 0,
    };
  }
  
  const assessmentScore = calculateAssessmentScore(profile);
  const conversationScore = calculateConversationScore(conversations, grade);
  const skillScore = calculateSkillScore(profile, grade);
  const manualScore = calculateManualScore(profile, grade);
  
  const totalScore = 
    assessmentScore * DEFAULT_CONFIG.assessmentWeight +
    conversationScore * DEFAULT_CONFIG.conversationWeight +
    skillScore * DEFAULT_CONFIG.skillWeight +
    manualScore * DEFAULT_CONFIG.manualWeight;
  
  return {
    assessment: Math.round(assessmentScore * 100),
    conversation: Math.round(conversationScore * 100),
    skill: Math.round(skillScore * 100),
    manual: Math.round(manualScore * 100),
    total: Math.round(totalScore * 100),
  };
}
