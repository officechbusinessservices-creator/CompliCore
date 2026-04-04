# 6. Risk Assessment & Mitigation

## 6.1 Risk Framework

### Risk Classification

| Severity | Impact | Examples |
|----------|--------|----------|
| **Critical** | Business-ending, regulatory action | Data breach, license revocation |
| **High** | Major revenue/reputation impact | Payment failure, OTA delisting |
| **Medium** | Significant but recoverable | Feature delay, partner issues |
| **Low** | Minor inconvenience | UI bugs, minor outages |

| Likelihood | Probability | Description |
|------------|-------------|-------------|
| **Almost Certain** | > 90% | Will happen without mitigation |
| **Likely** | 50-90% | Expected to occur |
| **Possible** | 25-50% | May occur |
| **Unlikely** | 5-25% | Not expected but possible |
| **Rare** | < 5% | Very unlikely |

---

## 6.2 Regulatory & Compliance Risks

### R1: GDPR/CCPA Non-Compliance

| Attribute | Assessment |
|-----------|------------|
| **Severity** | Critical |
| **Likelihood** | Possible |
| **Impact** | Fines up to 4% global revenue, operational restrictions |

**Risk Factors:**
- Improper data collection without consent
- Inadequate data subject rights implementation
- Cross-border data transfer violations
- Insufficient data retention policies

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Implement consent management platform | Legal + Eng | Phase 0 | Planned |
| Privacy-by-design architecture review | Security | Phase 0 | Planned |
| Data mapping and classification | Legal | Phase 0 | Planned |
| DPO appointment (if required) | Legal | Phase 1 | Planned |
| Regular compliance audits | Legal | Quarterly | Ongoing |
| Data subject request automation | Eng | Phase 1 | Planned |

**Contingency:**
- Legal counsel on retainer
- Cyber insurance with regulatory coverage
- Incident response plan documented

---

### R2: PCI DSS Non-Compliance

| Attribute | Assessment |
|-----------|------------|
| **Severity** | Critical |
| **Likelihood** | Unlikely |
| **Impact** | Loss of payment processing, fines, reputational damage |

**Risk Factors:**
- Improper card data handling
- Inadequate network security
- Insufficient access controls
- Failed security testing

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Use PCI-compliant payment gateway (Stripe) | Eng | Phase 0 | Planned |
| No card data touches our servers | Eng | Phase 0 | Planned |
| SAQ-A compliance documentation | Security | Phase 1 | Planned |
| Annual penetration testing | Security | Annual | Planned |
| Security awareness training | HR | Quarterly | Planned |

---

### R3: Local STR Regulation Violations

| Attribute | Assessment |
|-----------|------------|
| **Severity** | High |
| **Likelihood** | Likely |
| **Impact** | Fines to hosts, platform restrictions in markets |

**Risk Factors:**
- Hosts operating without permits
- Violation of local occupancy limits
- Tax collection requirements
- Building/zoning violations

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Regulatory database by market | Legal | Phase 2 | Planned |
| Host compliance acknowledgment | Product | Phase 1 | Planned |
| Permit/license field in listings | Eng | Phase 1 | Planned |
| Occupancy tax collection (where required) | Finance | Phase 2 | Planned |
| Regulatory monitoring service | Legal | Ongoing | Planned |

---

## 6.3 Data Privacy & Security Risks

### R4: Data Breach

| Attribute | Assessment |
|-----------|------------|
| **Severity** | Critical |
| **Likelihood** | Possible |
| **Impact** | Reputational damage, regulatory fines, lawsuits |

**Risk Factors:**
- Application vulnerabilities
- Insider threats
- Third-party breaches
- Social engineering

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Encryption at rest (AES-256) | Eng | Phase 0 | Planned |
| Encryption in transit (TLS 1.3) | Eng | Phase 0 | Planned |
| Field-level encryption for PII | Eng | Phase 0 | Planned |
| WAF and DDoS protection | DevOps | Phase 0 | Planned |
| Vulnerability scanning (continuous) | Security | Phase 0 | Planned |
| Penetration testing (annual) | Security | Annual | Planned |
| Security awareness training | HR | Quarterly | Planned |
| Bug bounty program | Security | Phase 2 | Planned |
| Zero-trust network architecture | DevOps | Phase 1 | Planned |

**Contingency:**
- Incident response plan
- Breach notification procedures
- Cyber insurance ($5M+ coverage)
- Forensics partner on retainer

---

### R5: AI/ML Data Misuse

| Attribute | Assessment |
|-----------|------------|
| **Severity** | High |
| **Likelihood** | Possible |
| **Impact** | Privacy violations, discrimination claims, regulatory action |

**Risk Factors:**
- Training data contains PII
- Model outputs reveal sensitive info
- Discriminatory outcomes
- Lack of transparency

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| AI ethics review board | Executive | Phase 1 | Planned |
| Bias testing for all models | ML | Per model | Planned |
| Data anonymization for training | ML | Per model | Planned |
| Explainability requirements | ML | Per model | Planned |
| Human oversight for adverse decisions | Product | Phase 1 | Planned |
| Opt-out mechanisms | Product | Phase 1 | Planned |
| Regular fairness audits | ML | Quarterly | Planned |

---

### R6: Third-Party Data Exposure

| Attribute | Assessment |
|-----------|------------|
| **Severity** | High |
| **Likelihood** | Possible |
| **Impact** | Breach via vendor, shared liability |

**Risk Factors:**
- Vendor security posture
- Data sharing agreements
- API security
- Vendor employee access

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Vendor security assessment | Security | Per vendor | Ongoing |
| Data processing agreements | Legal | Per vendor | Ongoing |
| Minimum necessary data sharing | Eng | Per integration | Ongoing |
| API access controls and monitoring | Eng | Phase 0 | Planned |
| Regular vendor audits | Security | Annual | Planned |
| SOC 2 requirement for critical vendors | Legal | Per vendor | Ongoing |

---

## 6.4 Vendor & API Risks

### R7: Payment Gateway Failure

| Attribute | Assessment |
|-----------|------------|
| **Severity** | High |
| **Likelihood** | Unlikely |
| **Impact** | Revenue loss, booking failures, guest/host frustration |

**Risk Factors:**
- Gateway outages
- API changes
- Account suspension
- Rate limiting

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Multi-gateway architecture | Eng | Phase 2 | Planned |
| Automatic failover | Eng | Phase 2 | Planned |
| Health monitoring and alerting | DevOps | Phase 0 | Planned |
| Gateway relationship management | Finance | Ongoing | Active |
| Retry logic with exponential backoff | Eng | Phase 0 | Planned |

**Contingency:**
- Manual payment processing procedure
- Guest communication templates
- Refund procedures documented

---

### R8: OTA API Dependency

| Attribute | Assessment |
|-----------|------------|
| **Severity** | High |
| **Likelihood** | Likely |
| **Impact** | Sync failures, booking conflicts, host churn |

**Risk Factors:**
- API rate limits
- Breaking API changes
- Access revocation
- Sync latency

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| iCal fallback for all channels | Eng | Phase 2 | Planned |
| API versioning strategy | Eng | Phase 2 | Planned |
| Robust error handling and retries | Eng | Phase 2 | Planned |
| Relationship with OTA partners | BD | Ongoing | Active |
| Sync monitoring and alerting | DevOps | Phase 2 | Planned |
| Conflict resolution automation | Eng | Phase 2 | Planned |

---

### R9: AI Service Provider Dependency

| Attribute | Assessment |
|-----------|------------|
| **Severity** | Medium |
| **Likelihood** | Possible |
| **Impact** | Feature degradation, cost increases |

**Risk Factors:**
- API outages
- Price increases
- Terms of service changes
- Model deprecation

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Multi-provider LLM gateway | Eng | Phase 1 | Planned |
| Fallback to simpler models | Eng | Phase 1 | Planned |
| Graceful degradation paths | Eng | Phase 1 | Planned |
| Cost monitoring and limits | Finance | Phase 1 | Planned |
| Evaluate self-hosted options | ML | Phase 3 | Planned |

---

## 6.5 Operational Risks

### R10: Platform Outage

| Attribute | Assessment |
|-----------|------------|
| **Severity** | High |
| **Likelihood** | Possible |
| **Impact** | Revenue loss, reputation damage, guest stranded |

**Risk Factors:**
- Infrastructure failure
- Code deployment issues
- Database corruption
- DDoS attack

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Multi-AZ deployment | DevOps | Phase 0 | Planned |
| Database replication | DevOps | Phase 0 | Planned |
| Blue-green deployments | DevOps | Phase 0 | Planned |
| Automated rollbacks | DevOps | Phase 0 | Planned |
| DDoS protection (Cloudflare) | DevOps | Phase 0 | Planned |
| Disaster recovery testing | DevOps | Quarterly | Planned |
| Status page for transparency | DevOps | Phase 1 | Planned |

**Recovery Targets:**
- RTO: < 1 hour
- RPO: < 15 minutes

---

### R11: Double Booking

| Attribute | Assessment |
|-----------|------------|
| **Severity** | High |
| **Likelihood** | Possible |
| **Impact** | Guest displacement, refunds, reputation damage |

**Risk Factors:**
- Race conditions
- Sync delays
- Manual errors
- System bugs

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Distributed locking for bookings | Eng | Phase 1 | Planned |
| Real-time availability checks | Eng | Phase 1 | Planned |
| Channel sync < 5 minutes | Eng | Phase 2 | Planned |
| Conflict detection and alerting | Eng | Phase 2 | Planned |
| Automated resolution workflows | Eng | Phase 2 | Planned |
| Overbooking insurance | Ops | Phase 2 | Planned |

---

### R12: Fraud and Chargebacks

| Attribute | Assessment |
|-----------|------------|
| **Severity** | Medium |
| **Likelihood** | Likely |
| **Impact** | Financial loss, payment processor issues |

**Risk Factors:**
- Stolen payment methods
- Friendly fraud
- Identity fraud
- Party bookings

**Mitigations:**
| Mitigation | Owner | Timeline | Status |
|------------|-------|----------|--------|
| Guest screening system | Eng | Phase 2 | Planned |
| ID verification for high-risk bookings | Eng | Phase 2 | Planned |
| Fraud scoring at checkout | Eng | Phase 1 | Planned |
| Chargeback evidence automation | Eng | Phase 1 | Planned |
| Host education on fraud prevention | Ops | Phase 1 | Planned |
| Security deposits | Product | Phase 1 | Planned |

---

## 6.6 Risk Register Summary

| ID | Risk | Severity | Likelihood | Score | Owner | Status |
|----|------|----------|------------|-------|-------|--------|
| R1 | GDPR/CCPA Non-Compliance | Critical | Possible | High | Legal | Open |
| R2 | PCI DSS Non-Compliance | Critical | Unlikely | Medium | Security | Open |
| R3 | Local STR Regulations | High | Likely | High | Legal | Open |
| R4 | Data Breach | Critical | Possible | High | Security | Open |
| R5 | AI/ML Data Misuse | High | Possible | Medium | ML | Open |
| R6 | Third-Party Data Exposure | High | Possible | Medium | Security | Open |
| R7 | Payment Gateway Failure | High | Unlikely | Medium | Eng | Open |
| R8 | OTA API Dependency | High | Likely | High | Eng | Open |
| R9 | AI Service Dependency | Medium | Possible | Medium | Eng | Open |
| R10 | Platform Outage | High | Possible | High | DevOps | Open |
| R11 | Double Booking | High | Possible | High | Eng | Open |
| R12 | Fraud/Chargebacks | Medium | Likely | Medium | Ops | Open |

---

## 6.7 Risk Monitoring

### Dashboard Metrics

| Risk Category | Key Metrics | Alert Threshold |
|--------------|-------------|-----------------|
| Security | Failed login attempts, WAF blocks | > 100/hour |
| Compliance | Data requests pending, consent rates | > 5 pending, < 90% |
| Payment | Chargeback rate, decline rate | > 1%, > 10% |
| Availability | Uptime, error rate | < 99.9%, > 0.1% |
| Fraud | Fraud score flags, suspicious bookings | > 5/day |
| Integration | Sync failures, API errors | > 1%, > 0.5% |

### Review Cadence

| Activity | Frequency | Participants |
|----------|-----------|--------------|
| Risk review meeting | Weekly | Tech leads, PM |
| Executive risk report | Monthly | Leadership |
| Full risk assessment | Quarterly | All stakeholders |
| Penetration testing | Annual | External vendor |
| Disaster recovery drill | Semi-annual | DevOps, Eng |
| Compliance audit | Annual | Legal, External |
