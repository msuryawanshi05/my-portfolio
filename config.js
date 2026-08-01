// -----------------------------------------------------------------------------
// PORTFOLIO CONFIG - Edit this file to update dynamic content instantly.
// No rebuilding needed. Just save and refresh the browser.
// -----------------------------------------------------------------------------

const PORTFOLIO_CONFIG = {

  // -- STATS (shown in About section) -----------------------------------------
  stats: {
    ctfRank:          '#3',    // ICYS CTF placement
    machines:          22,     // VulnHub / TryHackMe machines total
    certifications:     4,     // Number of certs
    leetcodeSolved:   10,     // Your current LeetCode solved count - update freely
  },

  // -- LEETCODE ----------------------------------------------------------------
  leetcode: {
    profileUrl: 'https://leetcode.com/u/msuryawanshi05/',
    // LeetCode doesn't provide an open CORS API, so we use the count above.
    // To update: change stats.leetcodeSolved above and refresh.
  },

  // -- RESUME ------------------------------------------------------------------
  // To update resume: just replace the PDF file in D:\Projs\portmy\assets\
  // with the same filename below. The site picks it up automatically.
  resume: {
    file: 'assets/Mukul_Resume.pdf',  // Security-focused resume
    swefile: 'assets/Swe Resume.pdf', // SWE resume (optional second)
  },

  // -- PROJECTS (add live URL if deployed, leave '' to hide Live button) ------
  projects: [
    {
      id:      'f1',
      name:    'PITWALL',
      github:  'https://github.com/msuryawanshi05/Project-f1',
      live:    '',
      show:    true,
    },
    {
      id:      'log',
      name:    'Portable Log Analysis Tool for Isolated Networks',
      github:  'https://github.com/msuryawanshi05/Portable-Log-Analysis-Tool',
      live:    '',
      show:    true,
    },
    {
      id:      'soc',
      name:    'Distributed SOC Platform',
      github:  'https://github.com/msuryawanshi05/Distributed-SOC-Platform',
      live:    '',
      show:    true,
    },
    {
      id:      'rxrewards',
      name:    'RxRewards',
      github:  'https://github.com/msuryawanshi05/RxRewards',
      live:    '',
      show:    true,
    },
    {
      id:      'ship',
      name:    'StoryShip - IP Leak Defense System',
      github:  'https://github.com/msuryawanshi05/IP-Leak-Defense-System-StoryShip',
      live:    '',
      show:    false, // Hidden until demo video added
    },
  ],

  // -- CERTIFICATES (only substantive ones shown - skip participation certs) --
  // Shown in Achievements section. Set show:true to display.
  certs: [
    { file: 'assets/Certify/CASA_Exam.pdf',                       label: 'CASA',          show: true  },
    { file: 'assets/Certify/ICYS.pdf',                            label: 'ICYS CTF',      show: true  },
    { file: 'assets/Certify/Cryptography and Network Security.pdf',label: 'NPTEL Crypto',  show: true  },
    { file: 'assets/Certify/IIRS GEOSAT.pdf',                     label: 'ISRO IIRS',     show: true  },
    { file: 'assets/Certify/Shadowfox_.pdf',                      label: 'ShadowFox',     show: true  },
    { file: 'assets/Certify/EncipherX.pdf',                       label: 'EncipherX',     show: true  },
    { file: 'assets/Certify/Crest Ctf.pdf',                       label: 'CREST CTF',     show: true  },
    { file: 'assets/Certify/Seasides_Goa.pdf',                    label: 'Seasides 2K26', show: true  },
    { file: 'assets/Certify/Unstop ehax ctf.pdf',                 label: 'eHax CTF',      show: true  },
    { file: 'assets/Certify/YCCE ctf.png',                        label: 'YCCE CTF',      show: true  },
    { file: 'assets/Certify/PECB_Certificate_of_Attestation.pdf', label: 'PECB',          show: true  },
    // Participation / minor certs - hidden:
    { file: 'assets/Certify/be10x.pdf',            label: 'Be10x',         show: false },
    { file: 'assets/Certify/codetantra.pdf',        label: 'CodeTantra',    show: false },
    { file: 'assets/Certify/HWI_volunter.pdf',      label: 'HWI Volunteer', show: false },
    { file: 'assets/Certify/Nikistain.pdf',         label: 'Nikistain',     show: false },
    { file: 'assets/Certify/TCS microintern.pdf',   label: 'TCS',           show: false },
  ],

  // -- SKILLS ------------------------------------------------------------------
  // Add or remove items freely. The page rebuilds on refresh.
  skills: {
    security: [
      'Vulnerability Assessment',
      'Penetration Testing',
      'Log Analysis',
      'OWASP Top 10',
      'SOC L1',
      'Incident Response',
      'Threat Analysis',
      'SIEM',
      'Burp Suite',
      'Metasploit',
      'Nmap',
      'Wireshark',
      'Nessus',
      'Wazuh',
      'OWASP ZAP',
      'IDS/IPS',
      'Traffic Analysis',
    ],
    development: [
      'Python',
      'C',
      'Java',
      'JavaScript',
      'HTML / CSS',
      'SQL',
      'Bash',
      'Git & GitHub',
      'Kali Linux',
      'Parrot OS',
      'Linux',
    ],

    // -- RADAR CHART DATA -------------------------------------------------------
    // Tune these 0-100 values freely — the radar chart reads from here.
    // Labels are the 5 domain categories shown on the chart axes.
    radar: [
      { label: 'Web Security',      value: 83 },
      { label: 'Scripting & Dev',   value: 79 },
      { label: 'Exploitation',      value: 72 },
      { label: 'SIEM / Monitoring', value: 61 },
      { label: 'Recon & OSINT',     value: 57 },
    ],
  },


};
