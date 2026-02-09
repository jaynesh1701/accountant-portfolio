
const fs = require('fs');
const path = require('path');

// 1. Read Data
// Note: We need to parse the data.js file which is a JS export, not JSON.
// We'll do a quick hack to evaluate it or regex it, or just copy the array here for simplicity/reliability in this env.
// Actually, let's read the file and eval it in a safe context or just regex the object.
// Given the environment, let's just copy the data array structure here to avoid complex parsing of the JS file.
// I will read the file content and use a regex to extract the array, or just paste the known data.
// Since I just read the file, I have the data. I'll paste it here for the script.

const portfolioData = [
    {
        id: 'kasumbo-movie',
        title: 'Kasumbo Movie',
        category: 'Entertainment Finance',
        heroImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
        summary: 'Complete financial management for a blockbuster historical drama.',
        challenge: 'Managing a complex production budget with thousands of daily transactions, vendor payments, and strict tax compliance (TDS) requirements under tight deadlines.',
        solution: 'We implemented a centralized digital expensing system, streamlined vendor onboarding for rapid TDS processing, and provided real-time budget vs. actuals reporting to the producers.',
        impact: 'Saved ~15% in potential leakage through strict audit controls and ensured 100% tax compliance with zero penalties during the 8-month production schedule.'
    },
    {
        id: 'abc-construction',
        title: 'ABC Construction',
        category: 'Construction & Infra',
        heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop',
        summary: 'End-to-end billing and tax compliance for a high-rise residential project.',
        challenge: 'The client faced issues with RA (Running Account) Bill milestones and reconciling GST input tax credits across multiple sub-contractors.',
        solution: 'Established a rigorous billing cycle aligned with RERA guidelines. We completely restructured their GST input mechanism to maximize eligible credits.',
        impact: 'Recovered ₹2.4 Crores in previously unclaimed Input Tax Credit and streamlined cash flow by reducing billing cycles from 45 days to 20 days.'
    },
    {
        id: 'tech-innovate',
        title: 'TechInnovate Solutions',
        category: 'Startup Advisory',
        heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
        summary: 'Financial modeling and valuation for Series A funding.',
        challenge: 'A rapidly growing SaaS startup needed robust financial projections and valuation verification to pitch to institutional investors.',
        solution: 'Developed a 5-year dynamic financial model, optimized their burn rate strategy, and managed the due diligence process.',
        impact: 'Client successfully raised $5M in Series A funding, with investors specifically praising the clarity and realism of the financial projections.'
    },
    {
        id: 'green-logistics',
        title: 'Green Logistics',
        category: 'Transport & Logistics',
        heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop',
        summary: 'GST and fuel tax optimization for a localized fleet.',
        challenge: 'Rising fuel costs and complex interstate GST regulations were eating into thin profit margins.',
        solution: 'Implemented a route-based cost analysis system and optimized E-Way bill compliance to prevent border delays.',
        impact: 'Reduced compliance-related delays by 90% and improved overall profit margins by 4% through better tax planning.'
    },
    {
        id: 'urban-retail',
        title: 'Urban Retail Chain',
        category: 'Retail',
        heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
        summary: 'Inventory accounting and franchise audits.',
        challenge: 'Discrepancies between physical inventory and books were causing massive year-end write-offs across 15 franchise outlets.',
        solution: 'Introduced perpetual inventory tracking procedures and conducted surprise quarterly audits.',
        impact: 'Shrinkage reduced by 75% within the first year, directly adding to the bottom line.'
    },
    {
        id: 'solar-power-inc',
        title: 'Solar Power Inc',
        category: 'Energy',
        heroImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1600&auto=format&fit=crop',
        summary: 'Capital subsidy management and project financing.',
        challenge: 'Navigating government subsidy applications and securing low-interest financing for a new solar park.',
        solution: 'Managed the entire documentation for government grants and liaised with banks for project loans.',
        impact: 'Secured ₹50 Lakhs in subsidies and a 1.5% lower interest rate on the term loan compared to market averages.'
    },
    {
        id: 'global-exports',
        title: 'Global Exports',
        category: 'Export/Import',
        heroImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1600&auto=format&fit=crop',
        summary: 'Forex management and export incentive claims.',
        challenge: 'Client was losing money on currency fluctuations and missing out on duty drawback benefits.',
        solution: 'Advising on hedging strategies and automating the duty drawback claim process.',
        impact: 'Increased export profitability by 6% purely through better financial management of incentives and forex.'
    },
    {
        id: 'med-care-hospital',
        title: 'MedCare Hospital',
        category: 'Healthcare',
        heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop',
        summary: 'Revenue cycle management and doctor payout structuring.',
        challenge: 'Complex payout structures for visiting consultants were leading to errors and dissatisfaction.',
        solution: 'Automated the revenue sharing calculation based on patient billing data.',
        impact: 'Zero errors in payouts for 12 consecutive months, improving doctor retention rates.'
    },
    {
        id: 'elite-hospitality',
        title: 'Elite Hospitality',
        category: 'Hospitality',
        heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop',
        summary: 'Cost control and food cost analysis.',
        challenge: 'Food cost percentages were fluctuating wildly without clear reasons.',
        solution: 'Implemented strict recipe costing and daily variance analysis reports.',
        impact: 'Stabilized food costs at 28% (down from 35%), significantly boosting net profit.'
    },
    {
        id: 'nextgen-edu',
        title: 'NextGen Education',
        category: 'Education',
        heroImage: 'https://plus.unsplash.com/premium_photo-1710708048497-5ec29c51580b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        summary: 'Fee reconciliation and trust compliance.',
        challenge: 'Managing fee collections from 2000+ students and ensuring compliance with charitable trust laws.',
        solution: 'Digitized the fee collection process and regularized trust filings.',
        impact: '100% compliance record and eliminated cash handling risks.'
    },
    {
        id: 'agro-corp',
        title: 'Agro Corp',
        category: 'Agriculture',
        heroImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1600&auto=format&fit=crop',
        summary: 'Subsidy planning for agricultural equipment.',
        challenge: 'Client was unaware of specific state-level subsidies for modernization.',
        solution: 'Identified relevant schemes and handled the application process.',
        impact: 'Client upgraded machinery with 40% government funding support.'
    },
    {
        id: 'fin-advisors',
        title: 'Prime FinAdvisors',
        category: 'Financial Services',
        heroImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop',
        summary: 'Regulatory compliance audit.',
        challenge: 'Ensuring adherence to new SEBI regulations for investment advisors.',
        solution: 'Conducted a comprehensive mock audit and updated all internal processes.',
        impact: 'Passed the actual SEBI inspection with zero non-compliance observations.'
    }
];

// 2. Read Template
const template = fs.readFileSync('project.html', 'utf8');

// 3. Generate Pages
if (!fs.existsSync('projects')) {
    fs.mkdirSync('projects');
}

portfolioData.forEach((project, index) => {
    let content = template;

    // Replace Placeholders
    content = content.replace(/Project Detail \| NikhilPokar/g, `${project.title} | NikhilPokar`);
    content = content.replace(/Project Title/g, project.title); // Basic replace
    content = content.replace('id="p-title" class="split-heading">Project Title', `id="p-title" class="split-heading">${project.title}`); // Targeted replace

    // Images
    // Note: We need to handle the src="" logic in template
    content = content.replace('src="" alt="Project Hero"', `src="${project.heroImage}" alt="${project.title}"`);

    // Text Content
    content = content.replace('Category', project.category); // Warning: might replace multiple
    content = content.replace('id="p-category" class="cat">Category', `id="p-category" class="cat">${project.category}`);
    content = content.replace('id="p-services">Strategic Finance', `id="p-services">${project.category}`);
    content = content.replace('id="p-challenge">Description of the challenge.', `id="p-challenge">${project.challenge}`);
    content = content.replace('id="p-solution">Description of the solution.', `id="p-solution">${project.solution}`);
    content = content.replace('id="p-impact" class="impact-text">Description of the impact.', `id="p-impact" class="impact-text">${project.impact}`);

    // Next Project Logic
    const nextIndex = (index + 1) % portfolioData.length;
    const nextProject = portfolioData[nextIndex];
    content = content.replace('id="p-next-title">Next Title', `id="p-next-title">${nextProject.title}`);
    content = content.replace('id="p-next-link" class="next-link"', `id="p-next-link" class="next-link" href="/projects/${nextProject.id}"`);

    // Write File
    const filePath = path.join('projects', `${project.id}.html`);
    fs.writeFileSync(filePath, content);
    console.log(`Generated: ${filePath}`);
});

console.log('Done generating static pages.');
