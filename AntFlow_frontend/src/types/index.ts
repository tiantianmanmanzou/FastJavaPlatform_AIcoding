export interface RoleSimple {
  roleId: number;
  roleName: string;
  roleCode: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  status: number;
  realName?: string;
  department?: string;
  mobile?: string;
  createTime?: string;
  updateTime?: string;
  roles?: RoleSimple[];
}

export interface Role {
  id: number;
  roleName: string;
  roleCode: string;
  description?: string;
  status: number;
  permissionIds?: number[];
  createTime?: string;
  updateTime?: string;
}

export interface Permission {
  id: number;
  permissionName: string;
  permissionCode: string;
  type: string;
  parentId?: number;
  path?: string;
  method?: string;
  sort?: number;
  createTime?: string;
  updateTime?: string;
}

export interface PermissionTreeNode {
  id: number;
  permissionName: string;
  permissionCode: string;
  type: string;
  path?: string;
  method?: string;
  children?: PermissionTreeNode[];
}

export interface LoginResult {
  token: string;
  expireAt: string;
  user: User;
}

export interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: string;
  source: string;
  userId?: string;
}

export interface TableColumn {
  prop: string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  sortable?: boolean;
  fixed?: "left" | "right";
  formatter?: (row: any, column: TableColumn) => string;
  children?: TableColumn[];
  slotName?: string;
}

export interface ActionButton {
  name: string;
  label: string;
  type?: "primary" | "default" | "dashed" | "text" | "link";
  size?: "large" | "middle" | "small";
  disabled?: boolean | ((row: any) => boolean);
}

export interface Tab {
  path: string;
  label: string;
  icon?: string;
}

// UI组件相关接口
export interface TabItem {
  id: string | number;
  label: string;
  icon?: string;
}

export interface DialogConfig {
  visible: boolean;
  title?: string;
  width?: string | number;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  slideFromRight?: boolean;
}

export interface SearchItem {
  label: string;
  prop: string;
  type: "input" | "select" | "daterange" | "date";
  options?: Array<{ label: string; value: any }>;
  placeholder?: string | string[];
}

export interface PaginationProps {
  total: number;
  current: number;
  pageSize: number;
  pageSizes?: number[];
  onChange?: (page: number, size: number) => void;
}

// TreeNode相关接口
export interface TreeNodeData {
  label: string;
  value: string | number;
  count?: number;
  children?: TreeNodeData[];
}

// FilterFields相关接口
export interface FilterField {
  prop: string;
  label: string;
  type: "tree" | "select";
  treeData?: TreeNodeData[];
  options?: Array<{ label: string; value: any }>;
}

// 商品上架管理相关接口
export interface ProductApply {
  id: string;
  productName: string;
  description: string;
  reason: string;
  shelfTime: string;
  applicant: string;
  approver: string;
  status: "pending" | "approved" | "rejected";
  applyTime: string;
  approveNote?: string;
  rejectNote?: string;
  remark?: string;
}

export interface ProductDisplay {
  id: string;
  productName: string;
  description: string;
  shelfTime: string;
  status: string;
  category?: string;
  price?: number;
  stock?: number;
}

// 产品管理
export interface ProductItem {
  id: number;
  productName: string;
  productCode: string;
  productType: string;
  description?: string;
  tags?: string[];
  status: number;
  createTime?: string;
  updateTime?: string;
  images?: ProductImage[];
  mainImageUrl?: string;
  imageCount?: number;
}

export interface ProductSimpleItem {
  id: number;
  productName: string;
  productType: string;
  description?: string;
  mainImageUrl?: string;
  imageCount?: number;
  imageUrls?: string[];
}

export interface ProductImage {
  id?: number;
  imageUrl: string;
  primary?: boolean;
  createTime?: string;
  updateTime?: string;
}

export interface LlmProvider {
  id: number;
  providerCode: string;
  providerName: string;
  providerType: string;
  vendor?: string;
  modelName?: string;
  baseUrl?: string;
  apiVersion?: string;
  status: number;
  defaultFlag?: number;
  concurrencyLimit?: number;
  timeoutSeconds?: number;
  capabilityTags?: string;
  description?: string;
  metadata?: string;
  lastSyncedAt?: string;
  createTime?: string;
  updateTime?: string;
  apiKey?: string;
  apiParams?: Record<string, string>;
}

export interface ReasoningThread {
  id: number;
  threadName: string;
  threadIdentifier: string;
  providerCode?: string;
  modelName?: string;
  status: string;
  messageCount: number;
  inputTokens: number;
  outputTokens: number;
  latencyMillis: number;
  errorMessage?: string;
  metadata?: string;
  lastActivityTime?: string;
  createTime?: string;
  updateTime?: string;
}

export interface ReasoningThreadMessage {
  id: number;
  threadId: number;
  role: string;
  content: string;
  tokenUsage?: number;
  latencyMillis?: number;
  createdAt?: string;
}

export interface ModelComparison {
  id: number;
  comparisonName: string;
  prompt: string;
  providerA?: string;
  modelA?: string;
  providerB?: string;
  modelB?: string;
  evaluationCriteria?: string;
  status: string;
  resultA?: string;
  resultB?: string;
  scoreA?: number;
  scoreB?: number;
  verdict?: string;
  winner?: string;
  evaluationNotes?: string;
  latencyA?: number;
  latencyB?: number;
  inputTokensA?: number;
  inputTokensB?: number;
  outputTokensA?: number;
  outputTokensB?: number;
  createdBy?: string;
  createTime?: string;
  updateTime?: string;
}

// 内容创作
export type ContentPlatform = "XIAOHONGSHU" | "WECHAT" | "DOUYIN";
export type ContentModuleType = "IMAGE" | "ARTICLE" | "VIDEO";
export type ContentModuleStatus = "DRAFT" | "GENERATING" | "GENERATED";
export type ContentApiVendor = "GOOGLE" | "DOUBAO" | "OPENAI" | "MINIMAX" | "KIMI" | "QWEN" | "GLM";

export interface ContentModuleResultItem {
  id?: number;
  moduleId: number;
  resultType: "IMAGE" | "TEXT" | "VIDEO";
  content?: string;
  assetUrl?: string;
  sortOrder?: number;
}

export interface ContentModuleItem {
  id: number;
  productId: number;
  platform: ContentPlatform;
  moduleType: ContentModuleType;
  moduleTitle: string;
  templateId?: number | null;
  prompt?: string;
  tone?: string;
  style?: string;
  contentLength?: string;
  subjectImageUrl?: string;
  imageStyle?: string;
  imageRatio?: string;
  imageQuantity?: number;
  videoStyle?: string;
  videoRatio?: string;
  videoDuration?: number;
  apiVendor?: ContentApiVendor;
  apiName?: string;
  sortOrder?: number;
  status: ContentModuleStatus;
  lastGeneratedAt?: string;
  createTime?: string;
  updateTime?: string;
  results?: ContentModuleResultItem[];
}

export interface ContentTemplateItem {
  id: number;
  templateName: string;
  platform: ContentPlatform;
  moduleType: ContentModuleType;
  description?: string;
  prompt?: string;
  tone?: string;
  style?: string;
  contentLength?: string;
  imageStyle?: string;
  imageRatio?: string;
  imageQuantity?: number;
  videoStyle?: string;
  videoRatio?: string;
  videoDuration?: number;
  apiVendor?: ContentApiVendor;
  apiName?: string;
  createTime?: string;
  updateTime?: string;
}

export type PromptType = "IMAGE" | "ARTICLE" | "VIDEO";

export interface PromptItem {
  id: number;
  name: string;
  content: string;
  type: PromptType;
  createTime: string;
  updateTime: string;
}
