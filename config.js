// -----------------------------------------------------------------------------
// PORTFOLIO CONFIG - Edit this file to update dynamic content instantly.
// No rebuilding needed. Just save and refresh the browser.
// -----------------------------------------------------------------------------

const PORTFOLIO_CONFIG = {

  // -- STATS (shown in About section) -----------------------------------------
  stats: {
    ctfRank:          '#3',       // ICYS CTF placement
    certifications:    '6',       // Number of core credentials
    thmRank:          'Top 10%',  // TryHackMe rank
    machines:          '25+',     // VulnHub / TryHackMe machines total
    htbStatus:        'Active',   // HackTheBox active labs
    leetcodeSolved:   '150+',     // LeetCode solved count
  },

  // -- PLATFORM PROFILES ------------------------------------------------------
  profiles: {
    tryhackme: 'https://tryhackme.com/p/msuryawanshi05',
    hackthebox: 'https://profile.hackthebox.com/profile/019fe6cd-1983-7008-9b4c-52c9297028e7?utm_medium=copy_url',
    leetcode:   'https://leetcode.com/u/msuryawanshi05/',
  },

  // -- LEETCODE (backwards compatibility) -------------------------------------
  leetcode: {
    profileUrl: 'https://leetcode.com/u/msuryawanshi05/',
  },

  // -- RESUME ------------------------------------------------------------------
  // To update resume: just replace the PDF file in assets/
  // with the same filename below. The site picks it up automatically.
  resume: {
    file: 'assets/Mukul_Resume.pdf',  // Security-focused resume
    swefile: 'assets/Swe Resume.pdf', // SWE resume (optional second)
  },

  // -- PROJECTS (add live/demo URL, leave '' to hide Demo button) -------------
  projects: [
    {
      id:          'soc',
      name:        'Distributed SOC for Lab',
      github:      'https://github.com/msuryawanshi05/SOC-for-Lab-',
      live:        'https://soc-lab.antideploy.app',
      show:        true,
      featured:    true,
      description: 'Distributed Security Operations Center (SOC) designed for isolated and multi-node lab environments with unified endpoint telemetry across Windows, Linux, and macOS. Ingests and normalizes 50,000+ daily security events using Wazuh SIEM and Syslog. Features custom Suricata detection rules, maintaining 98%+ alert fidelity across simulated multi-stage attacks.',
    },
    {
      id:          'log',
      name:        'Portable Log Analysis Tool for Isolated Networks',
      github:      'https://github.com/msuryawanshi05/Portable-Log-Analysis-Tool',
      live:        'https://www.youtube.com/watch?v=0CafFNWY91Q',
      show:        true,
      description: 'USB-deployable offline forensic analysis suite built for strictly air-gapped systems with zero network dependency. Engineered for the National Technical Research Organisation (NTRO) SIH problem statement, integrating rule-based threat signatures with statistical behavioral baselines to generate tamper-evident forensic audit reports. Automates EVTX and Syslog parsing, timeline reconstruction, and anomaly correlation while enforcing cryptographic SHA-256 evidence integrity.',
    },
    {
      id:          'ship',
      name:        'StoryShip - IP Leak Defense System',
      github:      'https://github.com/msuryawanshi05/IP-Leak-Defense-System-StoryShip',
      live:        'https://storyship.antideploy.app',
      show:        true,
      description: 'Decentralized content integrity and asset leak defense system. Uses perceptual hashing and IPFS content-addressed storage to enforce immutable audit trails and ownership provenance.',
    },
    {
      id:          'f1',
      name:        'Project F1 - Formula 1 Data Intelligence',
      github:      'https://github.com/msuryawanshi05/Project-f1',
      live:        '#', // Update with your Project F1 demo link
      show:        true,
      description: 'Engineer-grade Formula 1 timing and real-time telemetry dashboard. Bridges live Grand Prix sector delta timing, speed/throttle/braking comparison curves, and interactive GeoJSON canvas circuit maps. Features a dual-ingestion architecture streaming OpenF1 telemetry via FastAPI WebSockets into Zustand transient state.',
    },
  ],

  // -- CERTIFICATES (substantive certs shown on frontend) ---------------------
  certs: [
    { file: 'https://www.credly.com/badges/20f94722-b475-4928-a122-042f3cbdfe3f/public_url', label: 'ISC2 CC',         show: true },
    { file: 'https://www.credly.com/badges/cbdcc142-d067-4aaf-9c5e-f409172a5cc8/public_url', label: 'Red Hat RH134',   show: true },
    { file: 'assets/Certify/ICYS.pdf',                            label: 'ICYS CTF',      show: true },
    { file: 'assets/Certify/CASA_Exam.pdf',                       label: 'CASA',          show: true },
    { file: 'assets/Certify/Cryptography and Network Security.pdf',label: 'NPTEL Crypto',  show: true },
    { file: 'assets/Certify/IIRS GEOSAT.pdf',                     label: 'ISRO IIRS',     show: true },
    { file: 'https://www.credly.com/badges/1a32036b-df35-4726-b047-eaade6d2c31a/public_url', label: 'OpenShift DO180', show: true },
    { file: 'assets/Certify/Seasides_Goa.pdf',                    label: 'Seasides 2K26', show: true },
    { file: 'assets/Certify/EncipherX.pdf',                       label: 'EncipherX',     show: true },
  ],

  // -- SKILLS CATEGORIZATION --------------------------------------------------
  skills: {
    // 1. Offensive / VAPT
    offensive: [
      'Burp Suite',
      'Metasploit',
      'Nmap',
      'Wireshark',
      'OWASP Top 10',
      'Vulnerability Assessment',
      'Penetration Testing',
      'Nessus',
      'OWASP ZAP',
    ],

    // 2. Defensive / SOC & SIEM
    defensive: [
      'Wazuh',
      'Splunk',
      'SIEM',
      'IDS/IPS',
      'Traffic Analysis',
      'Incident Response',
      'Log Analysis',
      'Threat Analysis',
      'SOC L1',
    ],

    // 3. Platforms & Systems / Dev
    development: [
      'RHEL',
      'Linux',
      'Kali Linux',
      'Parrot OS',
      'Python',
      'FastAPI',
      'Flask',
      'Bash',
      'SQL',
      'Git & GitHub',
      'C',
      'Java',
    ],

    // Combined security list for terminal backwards compatibility
    security: [
      'Burp Suite',
      'Metasploit',
      'Nmap',
      'Wireshark',
      'OWASP Top 10',
      'Wazuh',
      'Splunk',
      'SIEM',
      'IDS/IPS',
      'Vulnerability Assessment',
      'Penetration Testing',
      'Incident Response',
      'Log Analysis',
      'Traffic Analysis',
    ],

    // -- RADAR CHART DATA -------------------------------------------------------
    radar: [
      { label: 'Web Security',      value: 83 },
      { label: 'Scripting & Dev',   value: 79 },
      { label: 'Exploitation',      value: 72 },
      { label: 'SIEM / Monitoring', value: 61 },
      { label: 'Recon & OSINT',     value: 57 },
    ],
  },

};
