export const ruleStrings: string[] = [
  '(URL not-contains "files";"libs";"blobfile";"assets") & (URL not-contains "dashboard" | (ClientIP != 20.20.33.24;20.20.41.128))',
  'URL contains "dei-myenergy" & ClientIP != 37.6.231.5',
  '(ASN == 123 & ASN != 123) | (ASN == 123 & (ASN != 123 | (ASN == 123 & ASN != 123)))',
  '(ASN == 123 & ASN != 123) | ((ASN == 123 & ASN != 123) | (ASN == 123 & ASN != 123))',
  'ClientType == HackingTool & (ASN != 29241 & ASN != 8075)',
  'ClientType == HackingTool & (ASN != 29241;8075)',
  'MaliciousIPList == TorIPs;AnonymousProxyIPs',
  'ClientType == Unknown & (ASN != 8075) & ClientIP != 20.20.44.64',
  'IPReputationRiskLevel == High',
  'IPReputationRiskLevel == Medium & CountryCode != GR',
  'ClientType == DDoSBot;Worm;MaskingProxy;ClickBot;CommentSpamBot;SpamBot;VulnerabilityScanner & ClientId != 453',
  '(URL not-contains "oauth";"saml") & (URL not-contains "/dashboard" | ( ClientIP != 20.20.44.64 )',
];
