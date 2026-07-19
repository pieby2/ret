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
            badge: "badge-inference"
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
            { title: "Extreme Fatigue", desc: "Client fell asleep during an office meeting on Day 7.", risk: "high", source: "confirmed" }, /* Treated as confirmed event */
            { title: "Acidity & Bloating", desc: "Persistent throughout the week, occasionally waking up with it.", risk: "medium", source: "reported" }
        ],
        missing: [
            { title: "Wearable Sync Data", desc: "No objective HR or sleep cycle data available.", source: "missing" }
        ]
    },
    action: {
        title: "Recommended Coach Action",
        desc: "Acknowledge the immense stress and validate her effort in maintaining steps/water. Focus this week entirely on 5-minute practical meal prep hacks (e.g., pre-ordering sprouts, boiling chana in bulk) rather than reducing food intake. Suggest a simple 5-min deep breathing protocol for office stress.",
        source: "inference"
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
            <span class="badge ${m.badge}"><i class="ph-fill ${m.source === 'reported' ? 'ph-user' : 'ph-brain'}"></i> ${m.source === 'reported' ? 'Client-Reported' : 'AI Inference'}</span>
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
                <button class="btn btn-primary"><i class="ph ph-chat-centered-text"></i> Draft Reply based on this</button>
            </div>
        </div>
    `;

    container.innerHTML = summaryCard + metricsCards + insightsCard + actionCard;
}

// Interactions
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();

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
