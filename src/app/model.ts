export interface SecurityRule {
  ClientType?: ClientTypeEnum;
  ClientId?: number;
  ClientIP?: string;
  CountryCode?: string;
  IPReputationRiskLevel?: IPReputationRiskLevelEnum;
  MaliciousIPList?: MaliciousIPListEnum;
  ASN?: number;
  URL?: string;
}

export class RuleSet {
  name?: string;
  rule?: string;
  ruleExpressions: RuleExpression[] = [];
  boolExpression?: string;
  result: boolean = false;
}

export interface RuleExpression {
  ruleExpression?: string;
  result?: boolean;
}

export interface ClientId {
  id: number;
  name: string;
}

export const VariableEnums: string[] = [
  'MaliciousIPList',
  'ClientType',
  'IPReputationRiskLevel',
  'CountryCode',
  'ASN',
  'ClientIP',
  'ClientId',
  'URL',
];

export enum IPReputationRiskLevelEnum {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum ClientTypeEnum {
  Browser = 'Browser',
  ClickBot = 'ClickBot',
  CommentSpamBot = 'CommentSpamBot',
  Crawler = 'Crawler',
  FeedFetcher = 'FeedFetcher',
  HackingTool = 'HackingTool',
  MaskingProxy = 'MaskingProxy',
  SearchBot = 'SearchBot',
  SiteHelper = 'SiteHelper',
  SpamBot = 'SpamBot',
  Unknown = 'Unknown',
  VulnerabilityScanner = 'VulnerabilityScanner',
  Worm = 'Worm',
  DDoSBot = 'DDoSBot',
}

export enum MaliciousIPListEnum {
  TorIPs = 'TorIPs',
  AnonymousProxyIPs = 'AnonymousProxyIPs',
}

// export class TokenClass {
//   type?: string;
//   value?: string;

//   public constructor(
//     type: 'Variable' | 'LParen' | 'RParen' | 'Value' | 'Operator' | 'Boolean',
//     value?: string
//   ) {
//     this.type = type;
//     this.value = value;
//   }
// }
