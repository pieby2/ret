const dashboardData = {
    summary: {
        text: "Client #8429 is a highly engaged but highly stressed working mother. Over the past week, extreme work and school pressure negatively impacted sleep (avg 5-6 hours) and caused extreme fatigue (falling asleep at work). She maintained good hydration (~4L) and steps (~6-8k), but struggled with meal prep time, leading to missed protein and inconsistent meals. Symptoms of severe acidity and bloating persist. By Day 8, a full night of sleep (8 hrs) significantly improved her energy.",
        source: "inference"
    },
    metrics: [
        {
            title: "Nutrition Adherence",
            icon: "ph-apple-logo",
            value: "Moderate",
            unit: "Inconsistent protein",
            source: "inference",
            badge: "badge-inference",
            confidence: "88%"
        },
        {
            title: "Avg Sleep",
            icon: "ph-moon",
            value: "5.5",
            unit: "hrs / night",
            source: "reported",
            badge: "badge-reported"
        },
        {
            title: "Avg Steps",
            icon: "ph-sneaker",
            value: "6.5k",
            unit: "steps / day",
            source: "reported",
            badge: "badge-reported"
        },
        {
            title: "Water Intake",
            icon: "ph-drop",
            value: "3.5-4",
            unit: "liters / day",
            source: "reported",
            badge: "badge-reported"
        }
    ],
    insights: {
        barriers: [
            { title: "Time Constraints", desc: "School drop-offs and hectic mornings prevent meal planning.", source: "reported" },
            { title: "Office Pressure", desc: "High stress and politics causing mental exhaustion.", source: "reported" }
        ],
        flags: [
            { 
                title: "Extreme Fatigue", 
                desc: "Client fell asleep during an office meeting on Day 7.", 
                risk: "high", 
                source: "reported",
                evidence: "\"During a meeting today I was so tired that my head went down on the table and I actually slept for a few seconds.\"" 
            },
            { 
                title: "Acidity & Bloating", 
                desc: "Persistent throughout the week, occasionally waking up with it.", 
                risk: "medium", 
                source: "reported",
                evidence: "\"Still having acidity and bloating... Got up with acidity.\"" 
            }
        ],
        missing: [
            { title: "Wearable Sync Data", desc: "No objective HR or sleep cycle data available.", source: "missing" }
        ]
    },
    action: {
        title: "Recommended Coach Action",
        desc: "Acknowledge the immense stress and validate her effort in maintaining steps/water. Focus this week entirely on 5-minute practical meal prep hacks (e.g., pre-ordering sprouts, boiling chana in bulk) rather than reducing food intake. Suggest a simple 5-min deep breathing protocol for office stress.",
        source: "inference",
        draft: "Hi there! I read through your updates. It sounds like you had an incredibly exhausting week with school and office politics—falling asleep in a meeting is a huge sign that your body needs a break! I want to validate that you still managed your water and steps despite all this stress, which is amazing. \n\nLet's not worry about eating 'less' right now. Can we focus purely on 5-minute prep hacks for this week? (Like ordering sprouts or keeping boiled chana handy). Also, would you be open to trying a simple 3-minute deep breathing exercise before your meetings?"
    }
};

function renderDashboard() {
    const container = document.getElementById('dashboard-content');
    
    // 1. Summary Card
    const summaryCard = `
        <div class="glass-panel card-summary">
            <h3 class="panel-title"><i class="ph ph-article"></i> Weekly Client Summary <span class="badge badge-inference" style="margin-left: auto"><i class="ph-fill ph-brain"></i> AI Inference</span></h3>
            <p class="summary-text">${dashboardData.summary.text}</p>
        </div>
    `;

    // 2. Metrics Cards
    const metricsCards = dashboardData.metrics.map(m => `
        <div class="glass-panel card-metric">
            <h3 class="panel-title"><i class="ph ${m.icon}"></i> ${m.title}</h3>
            <div class="metric-value">${m.value} <span class="metric-unit">${m.unit}</span></div>
            <div style="display: flex; gap: 8px; align-items: center; margin-top: 12px;">
                <span class="badge ${m.badge}"><i class="ph-fill ${m.source === 'reported' ? 'ph-user' : 'ph-brain'}"></i> ${m.source === 'reported' ? 'Client-Reported' : 'AI Inference'}</span>
                ${m.confidence ? `<span style="font-size: 11px; color: var(--text-secondary);"><i class="ph ph-target"></i> ${m.confidence} Confidence</span>` : ''}
            </div>
        </div>
    `).join('');

    // 3. Health & Symptoms (Insights)
    const insightsCard = `
        <div class="glass-panel card-insights">
            <h3 class="panel-title"><i class="ph ph-warning-circle"></i> Risk Flags & Barriers</h3>
            <div class="list-container">
                ${dashboardData.insights.flags.map(f => `
                    <div class="list-item">
                        <i class="ph-fill ph-warning" style="color: ${f.risk === 'high' ? 'var(--color-danger)' : 'var(--color-missing)'}"></i>
                        <div class="content">
                            <div class="title" style="color: ${f.risk === 'high' ? 'var(--color-danger)' : 'inherit'}">${f.title} <span class="badge badge-reported" style="margin-left: 8px"><i class="ph-fill ph-user"></i> Reported</span></div>
                            <div class="desc">${f.desc}</div>
                            ${f.evidence ? `
                                <div class="evidence-box">
                                    <div class="evidence-label"><i class="ph ph-quotes"></i> Source Quote (Traceability)</div>
                                    <div class="evidence-quote">${f.evidence}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
                ${dashboardData.insights.barriers.map(b => `
                    <div class="list-item">
                        <i class="ph-fill ph-barricade" style="color: var(--text-secondary)"></i>
                        <div class="content">
                            <div class="title">${b.title}</div>
                            <div class="desc">${b.desc}</div>
                        </div>
                    </div>
                `).join('')}
                ${dashboardData.insights.missing.map(m => `
                    <div class="list-item">
                        <i class="ph-fill ph-question" style="color: var(--color-missing)"></i>
                        <div class="content">
                            <div class="title">${m.title} <span class="badge badge-missing" style="margin-left: 8px"><i class="ph-fill ph-warning"></i> Missing</span></div>
                            <div class="desc">${m.desc}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // 4. Coach Action
    const actionCard = `
        <div class="glass-panel card-action">
            <h3 class="panel-title" style="color: var(--accent-primary)"><i class="ph-fill ph-lightbulb"></i> ${dashboardData.action.title} <span class="badge badge-inference" style="margin-left: auto"><i class="ph-fill ph-brain"></i> AI Inference</span></h3>
            <p class="summary-text" style="font-size: 16px; margin-top: 16px;">${dashboardData.action.desc}</p>
            <div style="margin-top: 24px; display: flex; gap: 12px;">
                <button id="btn-draft" class="btn btn-primary"><i class="ph ph-magic-wand"></i> Auto-Draft Reply</button>
            </div>
            
            <div id="draft-container" class="draft-box hidden">
                <div class="draft-header">
                    <span><i class="ph ph-robot"></i> AI Draft Message</span>
                    <div style="display:flex; gap: 8px;">
                        <button class="btn-icon" title="Copy to clipboard"><i class="ph ph-copy"></i></button>
                        <button class="btn-icon" title="Regenerate"><i class="ph ph-arrows-clockwise"></i></button>
                    </div>
                </div>
                <textarea class="draft-textarea" rows="7">${dashboardData.action.draft}</textarea>
                <div style="display:flex; justify-content: flex-end; margin-top: 12px;">
                    <button class="btn btn-primary" onclick="alert('Message sent to client profile!')"><i class="ph ph-paper-plane-right"></i> Send Message</button>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = summaryCard + metricsCards + insightsCard + actionCard;
}

// Interactions
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();

    // Draft Reply Toggle Logic
    const btnDraft = document.getElementById('btn-draft');
    const draftContainer = document.getElementById('draft-container');
    
    if (btnDraft && draftContainer) {
        btnDraft.addEventListener('click', () => {
            draftContainer.classList.toggle('hidden');
            if(!draftContainer.classList.contains('hidden')) {
                btnDraft.innerHTML = '<i class="ph ph-x"></i> Hide Draft';
                btnDraft.classList.remove('btn-primary');
                btnDraft.classList.add('btn-secondary');
            } else {
                btnDraft.innerHTML = '<i class="ph ph-magic-wand"></i> Auto-Draft Reply';
                btnDraft.classList.remove('btn-secondary');
                btnDraft.classList.add('btn-primary');
            }
        });
    }

    // Modal logic
    const modal = document.getElementById('edit-modal');
    document.getElementById('btn-edit').addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    document.getElementById('save-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
        alert('Changes saved temporarily.');
    });

    document.getElementById('btn-approve').addEventListener('click', () => {
        alert('Intelligence data approved and saved to client profile!');
    });

    document.getElementById('btn-reject').addEventListener('click', () => {
        if(confirm('Are you sure you want to discard this AI analysis?')) {
            alert('Analysis rejected.');
        }
    });
});
