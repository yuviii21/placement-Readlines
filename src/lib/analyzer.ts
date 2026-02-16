
export interface AnalysisResult {
    id: string;
    createdAt: string;
    company: string;
    role: string;
    jdText: string;
    skills: Record<string, string[]>;
    score: number;
    plan: { day: string; focus: string; tasks: string[] }[];
    checklist: { round: string; items: string[] }[];
    questions: string[];
    skillConfidenceMap?: Record<string, 'know' | 'practice'>;
}

const SKILL_KEYWORDS: Record<string, string[]> = {
    'Core CS': ['DSA', 'Data Structures', 'Algorithms', 'OOP', 'Object Oriented', 'DBMS', 'Database Management', 'OS', 'Operating Systems', 'Networks', 'Computer Networks', 'System Design'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C\\+\\+', 'C#', 'Golang', 'Go', 'Ruby', 'Swift', 'Kotlin', 'PHP', 'Rust'],
    'Web': ['React', 'Next.js', 'Node.js', 'Express', 'Angular', 'Vue', 'HTML', 'CSS', 'Tailwind', 'Redux', 'REST', 'GraphQL', 'API'],
    'Data': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis', 'Pandas', 'NumPy', 'Spark', 'Hadoop'],
    'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git', 'Linux', 'Terraform'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Mocha', 'JUnit', 'PyTest']
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

function extractSkills(text: string): Record<string, string[]> {
    const detectedSkills: Record<string, string[]> = {};
    const lowerText = text.toLowerCase();

    for (const [category, keywords] of Object.entries(SKILL_KEYWORDS)) {
        const found = keywords.filter(keyword => {
            // Escape special regex chars like +
            const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Look for whole word matches or typical variations
            const regex = new RegExp(`\\b${escaped.toLowerCase()}\\b`, 'i');
            return regex.test(lowerText);
        });

        if (found.length > 0) {
            detectedSkills[category] = found;
        }
    }

    // If absolutely nothing found, add a fallback
    if (Object.keys(detectedSkills).length === 0) {
        detectedSkills['General'] = ['Communication', 'Problem Solving'];
    }

    return detectedSkills;
}

function calculateScore(skills: Record<string, string[]>, jdText: string, company: string, role: string): number {
    let score = 35; // Base score

    // Categorical density
    const categoriesPresent = Object.keys(skills).filter(k => k !== 'General').length;
    score += Math.min(30, categoriesPresent * 5); // Max 30 for categories

    // Metadata completeness
    if (company && company.length > 2) score += 10;
    if (role && role.length > 2) score += 10;

    // Detail depth
    if (jdText.length > 800) score += 10;
    else if (jdText.length > 400) score += 5;

    // Cap at 100
    return Math.min(100, score);
}

function generatePlan(skills: Record<string, string[]>): { day: string; focus: string; tasks: string[] }[] {
    const allSkills = Object.values(skills).flat();
    const hasWeb = skills['Web'];

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

function generateChecklist(skills: Record<string, string[]>): { round: string; items: string[] }[] {
    const flattenedSkills = Object.values(skills).flat().join(', ');

    return [
        { round: 'Round 1: Aptitude & Basics', items: ['Quantitative Aptitude (Time & Work, Profit/Loss)', 'Logical Reasoning', 'Verbal Ability', 'Basic Technical MCQs'] },
        { round: 'Round 2: Coding & DSA', items: ['Array/String manipulation', 'HashMaps & Sets', 'Two Pointer approach', 'Standard algorithms (BFS/DFS)'] },
        { round: 'Round 3: Technical Interview', items: [`Deep dive into ${flattenedSkills}`, 'Project walkthrough', 'Database queries & Schema design', 'System Design basics'] },
        { round: 'Round 4: HR / Managerial', items: ['"Why this company?"', 'Salary expectations', 'Relocation & Bond discussion', 'Company research'] }
    ];
}

function generateQuestions(skills: Record<string, string[]>): string[] {
    let questions: string[] = [];

    // Prioritize specific category questions
    Object.keys(skills).forEach(cat => {
        // rudimentary mapping
        if (cat === 'Languages') {
            skills[cat].forEach(lang => {
                const key = Object.keys(QUESTIONS_DB).find(k => k.toLowerCase() === lang.toLowerCase());
                if (key) questions.push(...QUESTIONS_DB[key]);
                else if (lang.toLowerCase().includes('java')) questions.push(...QUESTIONS_DB['Java']);
                else if (lang.toLowerCase().includes('python')) questions.push(...QUESTIONS_DB['Python']);
            });
        }
        if (cat === 'Web') {
            if (skills[cat].some(s => s.toLowerCase().includes('react'))) questions.push(...QUESTIONS_DB['React']);
            questions.push('Explain the client-server architecture.');
        }
        if (cat === 'Data') {
            if (skills[cat].some(s => s.toLowerCase().includes('sql'))) questions.push(...QUESTIONS_DB['SQL']);
        }
        if (cat === 'Core CS') {
            if (skills[cat].some(s => s.toLowerCase().includes('dsa') || s.toLowerCase().includes('algo'))) questions.push(...QUESTIONS_DB['DSA']);
            if (skills[cat].some(s => s.toLowerCase().includes('system design'))) questions.push(...QUESTIONS_DB['System Design']);
        }
    });

    // Fill with defaults if needed
    if (questions.length < 5) {
        questions.push(...QUESTIONS_DB['Default']);
    }

    // Deduplicate and limit to 10
    return Array.from(new Set(questions)).slice(0, 10);
}

export function analyzeJD(company: string, role: string, jdText: string): AnalysisResult {
    const skills = extractSkills(jdText);
    const score = calculateScore(skills, jdText, company, role);
    return {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        company,
        role,
        jdText,
        skills,
        score,
        plan: generatePlan(skills),
        checklist: generateChecklist(skills),
        questions: generateQuestions(skills),
        skillConfidenceMap: {}
    };
}
