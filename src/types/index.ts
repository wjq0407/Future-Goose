export type UserGrade = 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';

export interface UserProfile {
  grade: UserGrade | null;
  interests: string[];
  skills: Record<string, number>;
  careerDirection: string[];
  goals: string[];
  assessmentScore: number;
  assessmentCompleted: boolean;
  milestones: Record<string, boolean>;
}

export interface ChatAttachment {
  name: string;
  size: number;
  type: string;
  content?: string;
  preview?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning_content?: string;
  timestamp: number;
  scene?: ChatSceneId;
  attachments?: ChatAttachment[];
}

export interface Conversation {
  id: string;
  title: string;
  scene: ChatSceneId;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export type ChatSceneId = 'career' | 'interview' | 'resume';

export interface ChatScene {
  id: ChatSceneId;
  name: string;
  icon: string;
  description: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  deadline?: string;
}

export interface Resource {
  id: string;
  type: 'course' | 'certificate' | 'internship' | 'article';
  title: string;
  description: string;
  url: string;
  icon: string;
  priority?: 'high' | 'medium' | 'low';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  minGrade?: UserGrade;
}

export type ResourceFilterType = Resource['type'] | 'all';
export type ResourceSortBy = 'priority' | 'difficulty' | 'title' | 'type';
export type ResourceDifficulty = Resource['difficulty'] | 'all';

export interface ResourceFilterOptions {
  type: ResourceFilterType;
  difficulty: ResourceDifficulty;
  tag?: string;
  sortBy: ResourceSortBy;
  sortOrder: 'asc' | 'desc';
}

export interface GrowthPath {
  grade: UserGrade;
  milestones: Milestone[];
  resources: Resource[];
}

export interface TencentJob {
  id: string;
  category: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  qualifications?: string[];
  plusItems?: string[];
  location?: string;
  applyLink?: string;
  bgName?: string;
  productName?: string;
  workYears?: string;
  recruitSubType?: 'fresh' | 'intern';
  fullDescription?: string;
  fullResponsibilities?: string[];
  fullRequirements?: string[];
  detailLoading?: boolean;
  detailLoaded?: boolean;
}

export interface TencentCulture {
  title: string;
  description: string;
  icon: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: string;
  action?: {
    label: string;
    target: string;
  };
}

export interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  isShowing: boolean;
}

export interface FavoriteJob {
  jobId: string;
  favoritedAt: number;
}

export interface TencentJobApiResponse {
  Code: number;
  Data: {
    Count: number;
    Posts: TencentAPIJobPost[];
  };
}

export interface TencentAPIJobPost {
  Id: number;
  PostId: string;
  RecruitPostId: number;
  RecruitPostName: string;
  CountryName: string;
  LocationName: string;
  BGName: string;
  ComCode: string;
  ComName: string;
  ProductName: string;
  CategoryName: string;
  Responsibility: string;
  LastUpdateTime: string;
  PostURL: string;
  SourceID: number;
  IsCollect: boolean;
  IsValid: boolean;
  RequireWorkYearsName: string;
}

export interface TencentCampusPosition {
  id: number;
  bgList: string;
  positionId: number;
  positionName: string;
  recruitCity: string;
  recruitCountry: string;
  workCity: string;
  workCountry: string;
  positionCategory: string;
  positionType: string;
  recruitType: string;
  positionDesc: string;
  positionDetail?: string;
  positionFid: string;
  positionFName: string;
}

export interface TencentCampusSearchResponse {
  code: number;
  msg: string;
  data: {
    total: number;
    positionList: TencentCampusPosition[];
  };
}

export interface TencentCampusDetailResponse {
  code: number;
  msg: string;
  data: TencentCampusPosition & {
    positionDetail: string;
  };
}

export interface TencentJobQueryParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: string;
  bgIds?: string;
  locationName?: string;
  language?: string;
  area?: string;
}
