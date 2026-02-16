
export interface AnalysisResult {
    id: string;
    createdAt: string;
    updatedAt: string;
    company: string;
    role: string;
    jdText: string;
    extractedSkills: {
        coreCS: string[];
        languages: string[];
        web: string[];
        data: string[];
        cloud: string[];
        testing: string[];
        other: string[];
    };
    baseScore: number;
    finalScore: number;
    plan7Days: { day: string; focus: string; tasks: string[] }[];
    checklist: { round: string; items: string[] }[];
    questions: string[];
    skillConfidenceMap: Record<string, 'know' | 'practice'>;
    companyIntel: CompanyIntel;
    roundMapping: RoundMapping[];
}

export interface CompanyIntel {
    size: 'Startup' | 'Mid-size' | 'Enterprise';
    industry: string;
    hiringFocus: string;
}

export interface RoundMapping {
    round: string;
    focus: string;
    description: string;
}

const SKILL_KEYWORDS: Record<string, string[]> = {
    'coreCS': ['DSA', 'Data Structures', 'Algorithms', 'OOP', 'Object Oriented', 'DBMS', 'Database Management', 'OS', 'Operating Systems', 'Networks', 'Computer Networks', 'System Design'],
    'languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C\\+\\+', 'C#', 'Golang', 'Go', 'Ruby', 'Swift', 'Kotlin', 'PHP', 'Rust'],
    'web': ['React', 'Next.js', 'Node.js', 'Express', 'Angular', 'Vue', 'HTML', 'CSS', 'Tailwind', 'Redux', 'REST', 'GraphQL', 'API'],
    'data': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis', 'Pandas', 'NumPy', 'Spark', 'Hadoop'],
    'cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git', 'Linux', 'Terraform'],
    'testing': ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Mocha', 'JUnit', 'PyTest']
};

const QUESTIONS_DB: Record<string, string[]> = {
    'Java': ['Explain the difference between JDK, JRE, and JVM.', 'What are the main principles of OOP?', 'Explain HashMap internal working.'],
    'Python': ['What illustrate the difference between list and tuple?', 'Explain decorators in Python.', 'How does memory management work in Python?'],
    'JavaScript': ['Explain closures and give an example.', 'Difference between var, let, and const.', 'How does the Event Loop work?'],
    'React': ['Explain the Virtual DOM.', 'Difference between useEffect and useLayoutEffect.', 'What are Higher-Order Components?'],
    'SQL': ['Explain the difference between WHERE and HAVING.', 'What is normalization? Explain 1NF, 2NF, 3NF.', 'Explain ACID properties.'],
    'DSA': ['How would you implement a Queue using Stacks?', 'Time complexity of QuickSort vs MergeSort.', 'Detect a cycle in a linked list.'],
    'System Design': ['Design a URL shortener.', 'How would you scale a read-heavy system?', 'Explain Load Balancing algorithms.'],
    'Default': ['Tell me about yourself.', 'What are your strengths and weaknesses?', 'Why do you want to join us?']
};

function extractSkills(text: string): AnalysisResult['extractedSkills'] {
    const detected: AnalysisResult['extractedSkills'] = {
        coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: []
    };
    const lowerText = text.toLowerCase();

    for (const [category, keywords] of Object.entries(SKILL_KEYWORDS)) {
        const found = keywords.filter(keyword => {
            const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped.toLowerCase()}\\b`, 'i');
            return regex.test(lowerText);
        });
        if (found.length > 0) {
            // @ts-ignore - we know keys match
            detected[category] = found;
        }
    }

    // Fallback if empty
    const totalFound = Object.values(detected).flat().length;
    if (totalFound === 0) {
        detected.other = ['Communication', 'Problem Solving', 'Basic Coding', 'Projects'];
    }

    return detected;
}

function calculateScore(skills: AnalysisResult['extractedSkills'], jdText: string, company: string, role: string): number {
    let score = 35; // Base score

    // Categorical density
    const categoriesPresent = Object.values(skills).filter(s => s.length > 0).length;
    score += Math.min(30, categoriesPresent * 5);

    // Metadata completeness
    if (company && company.length > 2) score += 10;
    if (role && role.length > 2) score += 10;

    // Detail depth
    if (jdText.length > 800) score += 10;
    else if (jdText.length > 400) score += 5;

    return Math.min(100, score);
}

function generatePlan(skills: AnalysisResult['extractedSkills']): { day: string; focus: string; tasks: string[] }[] {
    const allSkills = Object.values(skills).flat();
    const hasWeb = skills.web.length > 0;

    return [
        { day: 'Day 1', focus: 'Foundation & Core CS', tasks: ['Revise Oops concepts', 'Brush up on DBMS normalization', 'Review OS basics (Process, Threads)'] },
        { day: 'Day 2', focus: 'Language Basics', tasks: [`Deep dive into ${allSkills[0] || 'your primary language'} syntax`, 'Practice basic output tracing questions', 'Memory management concepts'] },
        { day: 'Day 3', focus: 'Data Structures', tasks: ['Practice Array & String problems', 'Linked List manipulation', 'Stack & Queue implementation'] },
        { day: 'Day 4', focus: 'Algorithms', tasks: ['Sorting & Searching algorithms', 'Recursion & Backtracking basics', 'Solve 3 medium LeetCode/GFG problems'] },
        { day: 'Day 5', focus: 'Project & Stack', tasks: [hasWeb ? 'Review React/Node.js lifecycle & patterns' : 'Review project architecture', 'Prepare "Challenges faced" stories', 'System Design basics (Scalability, CAP theorem)'] },
        { day: 'Day 6', focus: 'Mock Interviews', tasks: ['Peer mock interview (1 hour)', 'Behavioral answers (STAR method)', 'Review resume points'] },
        { day: 'Day 7', focus: 'Revision', tasks: ['Revise weak areas from mock', 'Review formula sheets / rapid fire notes', 'Rest & mental preparation'] }
    ];
}

function generateChecklist(skills: AnalysisResult['extractedSkills']): { round: string; items: string[] }[] {
    const flattenedSkills = Object.values(skills).flat().slice(0, 5).join(', ');

    return [
        { round: 'Round 1: Aptitude & Basics', items: ['Quantitative Aptitude (Time & Work, Profit/Loss)', 'Logical Reasoning', 'Verbal Ability', 'Basic Technical MCQs'] },
        { round: 'Round 2: Coding & DSA', items: ['Array/String manipulation', 'HashMaps & Sets', 'Two Pointer approach', 'Standard algorithms (BFS/DFS)'] },
        { round: 'Round 3: Technical Interview', items: [`Deep dive into ${flattenedSkills || 'core skills'}`, 'Project walkthrough', 'Database queries & Schema design', 'System Design basics'] },
        { round: 'Round 4: HR / Managerial', items: ['"Why this company?"', 'Salary expectations', 'Relocation & Bond discussion', 'Company research'] }
    ];
}

function generateQuestions(skills: AnalysisResult['extractedSkills']): string[] {
    let questions: string[] = [];

    // Map new categories to DB lookups
    skills.languages.forEach(lang => {
        const key = Object.keys(QUESTIONS_DB).find(k => k.toLowerCase() === lang.toLowerCase());
        if (key) questions.push(...QUESTIONS_DB[key]);
        else if (lang.toLowerCase().includes('java')) questions.push(...QUESTIONS_DB['Java']);
        else if (lang.toLowerCase().includes('python')) questions.push(...QUESTIONS_DB['Python']);
    });

    if (skills.web.some(s => s.toLowerCase().includes('react'))) questions.push(...QUESTIONS_DB['React']);
    if (skills.web.length > 0) questions.push('Explain the client-server architecture.');

    if (skills.data.some(s => s.toLowerCase().includes('sql'))) questions.push(...QUESTIONS_DB['SQL']);

    if (skills.coreCS.some(s => s.toLowerCase().includes('dsa') || s.toLowerCase().includes('algo'))) questions.push(...QUESTIONS_DB['DSA']);
    if (skills.coreCS.some(s => s.toLowerCase().includes('system design'))) questions.push(...QUESTIONS_DB['System Design']);

    // Fill with defaults
    if (questions.length < 5) {
        questions.push(...QUESTIONS_DB['Default']);
    }

    return Array.from(new Set(questions)).slice(0, 10);
}

const KNOWN_ENTERPRISES = ['google', 'microsoft', 'amazon', 'meta', 'apple', 'netflix', 'tcs', 'infosys', 'wipro', 'accenture', 'capgemini', 'cognizant', 'ibm', 'oracle', 'cisco', 'adobe', 'salesforce', 'uber', 'linkedin', 'twitter', 'flipkart', 'walmart', 'paytm', 'zomato', 'swiggy', 'ola'];

function getCompanyIntel(company: string): CompanyIntel {
    const lower = company.toLowerCase().trim();
    let size: 'Startup' | 'Mid-size' | 'Enterprise' = 'Startup';
    let industry = 'Technology';
    let hiringFocus = 'Practical application, development speed, and full-stack capabilities.';

    if (KNOWN_ENTERPRISES.some(e => lower.includes(e))) {
        size = 'Enterprise';
        if (['tcs', 'infosys', 'wipro', 'accenture', 'cognizant', 'capgemini'].some(e => lower.includes(e))) {
            industry = 'IT Services';
            hiringFocus = 'Mass hiring, aptitude, core CS fundamentals, and trainability.';
        } else {
            industry = 'Product';
            hiringFocus = 'Data Structures & Algorithms (DSA), System Design, and Scalability.';
        }
    } else {
        if (lower.includes('solutions') || lower.includes('systems') || lower.includes('technologies') || lower.includes('pvt') || lower.includes('ltd')) {
            size = 'Mid-size';
            hiringFocus = 'Balanced overlap of specific tech stack skills and problem solving.';
        }
    }

    return { size, industry, hiringFocus };
}

function generateRoundMapping(intel: CompanyIntel): RoundMapping[] {
    const rounds: RoundMapping[] = [];

    if (intel.size === 'Enterprise' && intel.industry === 'IT Services') {
        rounds.push({ round: 'Round 1: Online Assessment', focus: 'Aptitude & Logic', description: 'Quantitative, Logical Reasoning, and Verbal Ability tests to filter candidates.' });
        rounds.push({ round: 'Round 2: Technical Interview 1', focus: 'Basics & Core CS', description: 'Questions on OOPs, DBMS, SQL, and basic coding (Arrays/Strings).' });
        rounds.push({ round: 'Round 3: Technical Interview 2', focus: 'Project & Advanced', description: 'Deep dive into your resume projects and slightly harder technical concepts.' });
        rounds.push({ round: 'Round 4: HR Discussion', focus: 'Behavioral', description: 'Willingness to relocate, work shifts, and company culture fit.' });
    } else if (intel.size === 'Enterprise') {
        rounds.push({ round: 'Round 1: Coding Challenge', focus: 'DSA', description: '1-2 LeetCode Medium/Hard problems on HackerRank/CodeSignal.' });
        rounds.push({ round: 'Round 2: Technical Loop 1', focus: 'DSA & Problem Solving', description: 'Live coding session focusing on algorithmic optimization.' });
        rounds.push({ round: 'Round 3: Technical Loop 2', focus: 'System Design / LLD', description: 'Designing scalable components or Low Level Design (Class diagrams).' });
        rounds.push({ round: 'Round 4: Behavioral / Hiring Manager', focus: 'Culture Fit', description: 'Situation-based questions (STAR method) and team fit.' });
    } else {
        rounds.push({ round: 'Round 1: Screening / Take-home', focus: 'Practical Skill', description: 'A small assignment or discussion to verify you can write code.' });
        rounds.push({ round: 'Round 2: Machine Coding', focus: 'Live Dev', description: 'Building a small feature or component live (e.g., React component or API endpoint).' });
        rounds.push({ round: 'Round 3: Tech & Culture', focus: 'Depth & Fit', description: 'Discussing past challenges, rapid-fire stack questions, and "Why us?".' });
        rounds.push({ round: 'Round 4: Founder/CTO Round', focus: 'Vision', description: 'Final conversation about your drive and the company goal.' });
    }
    return rounds;
}

export function analyzeJD(company: string, role: string, jdText: string): AnalysisResult {
    const extractedSkills = extractSkills(jdText);
    const score = calculateScore(extractedSkills, jdText, company, role);
    const companyIntel = getCompanyIntel(company);

    return {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company,
        role,
        jdText,
        extractedSkills,
        baseScore: score,
        finalScore: score, // Initially same as base
        plan7Days: generatePlan(extractedSkills),
        checklist: generateChecklist(extractedSkills),
        questions: generateQuestions(extractedSkills),
        skillConfidenceMap: {},
        companyIntel,
        roundMapping: generateRoundMapping(companyIntel)
    };
}
