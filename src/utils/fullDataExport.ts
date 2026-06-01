import { UserProfile, Conversation, FavoriteJob, OnboardingState } from '@/types';

export type ExportScope = 'all' | 'profile-only' | 'conversations-only' | 'favorites-only';

export interface FullDataExport {
  exportMeta: {
    version: string;
    exportDate: string;
    exportTimestamp: number;
    platform: string;
    scope: ExportScope;
  };
  profile: UserProfile;
  onboarding: OnboardingState;
  conversations: Conversation[];
  favoriteJobs: FavoriteJob[];
  statistics: {
    totalConversations: number;
    totalMessages: number;
    totalFavorites: number;
    assessmentCompleted: boolean;
    assessmentScore: number;
  };
}

export function generateFullDataExport(
  profile: UserProfile,
  onboarding: OnboardingState,
  conversations: Conversation[],
  favoriteJobs: FavoriteJob[],
  scope: ExportScope = 'all'
): FullDataExport {
  const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);

  const statistics = {
    totalConversations: conversations.length,
    totalMessages,
    totalFavorites: favoriteJobs.length,
    assessmentCompleted: profile.assessmentCompleted,
    assessmentScore: profile.assessmentScore,
  };

  return {
    exportMeta: {
      version: '1.0.0',
      exportDate: new Date().toLocaleString('zh-CN'),
      exportTimestamp: Date.now(),
      platform: '未来鹅大学生职业成长AI陪伴平台',
      scope,
    },
    profile,
    onboarding,
    conversations,
    favoriteJobs,
    statistics,
  };
}

export function sanitizeExportData(data: FullDataExport): FullDataExport {
  const sanitizedConversations = data.conversations.map(conv => ({
    ...conv,
    messages: conv.messages.map(msg => {
      const { attachments, ...rest } = msg;
      if (attachments && attachments.length > 0) {
        return {
          ...rest,
          attachments: attachments.map(att => {
            return {
              size: att.size,
              type: att.type,
              name: att.name,
            };
          }),
        };
      }
      return rest;
    }),
  }));

  return {
    ...data,
    conversations: sanitizedConversations,
  };
}

export function exportDataToJSON(data: FullDataExport, pretty: boolean = true): string {
  return JSON.stringify(data, null, pretty ? 2 : undefined);
}

export function downloadExportFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getExportFilename(scope: ExportScope, timestamp?: number): string {
  const now = timestamp ? new Date(timestamp) : new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  
  const scopeMap: Record<ExportScope, string> = {
    all: '全部数据',
    'profile-only': '个人画像',
    'conversations-only': '对话记录',
    'favorites-only': '收藏岗位',
  };
  
  return `未来鹅_${scopeMap[scope]}_${dateStr}_${timeStr}.json`;
}