document.addEventListener('DOMContentLoaded', () => {
    // 平滑滚动
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 加载数据
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderProfile(data.profile);
            renderEducation(data.education);
            renderResearch(data.research);
            renderProjects(data.projects);
            renderInternships(data.internships);
            renderCampus(data.campus);
            renderSkills(data.skills);
            renderHonors(data.honors);
            renderInterests(data.interests);
        })
        .catch(error => console.error('Error loading data:', error));
});

function renderProfile(profile) {
    document.getElementById('nav-logo').textContent = profile.name;
    document.getElementById('footer-text').innerHTML = `&copy; 2025 ${profile.name}. All Rights Reserved.`;
    document.title = `${profile.name} | 个人主页`;

    const heroContent = document.getElementById('hero-content');
    const tagsHtml = profile.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    heroContent.innerHTML = `
        <div class="profile-photo">
            <img src="${profile.avatar}" alt="${profile.name}">
        </div>
        <div class="profile-text">
            <h1 class="name">${profile.name}</h1>
            <p class="title">${profile.title}</p>
            <div class="tags">
                ${tagsHtml}
            </div>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${profile.contact.email}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${profile.contact.phone}</span>
                </div>
            </div>
            <div class="intro-text">
                <p>${profile.intro}</p>
            </div>
        </div>
    `;
}

function renderEducation(education) {
    const container = document.getElementById('education-timeline');
    container.innerHTML = education.map(edu => `
        <div class="timeline-item">
            <div class="time">${edu.time}</div>
            <div class="content">
                <h3>${edu.school}</h3>
                <p>${edu.major.replace(/\n/g, '<br>')}</p>
                ${edu.desc ? `<p class="desc">${edu.desc}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function renderResearch(research) {
    // 研究简介
    const introContainer = document.getElementById('research-intro');
    introContainer.innerHTML = `
        <h3>研究方向</h3>
        ${research.intro.map(p => `<p>${p}</p>`).join('')}
    `;

    // 统计数据
    const statsContainer = document.getElementById('research-stats');
    statsContainer.innerHTML = research.stats.map(stat => `
        <div class="stat-card">
            <i class="${stat.icon}"></i>
            <span class="number">${stat.number}</span>
            <span class="label">${stat.label}</span>
        </div>
    `).join('');

    // 论文
    const papersContainer = document.getElementById('research-papers');
    papersContainer.innerHTML = research.papers.map(paper => `<li>${paper}</li>`).join('');

    // 专利
    const patentsContainer = document.getElementById('research-patents');
    patentsContainer.innerHTML = research.patents.map(patent => `<li>${patent}</li>`).join('');
}

function renderProjects(projects) {
    const container = document.getElementById('projects-list');
    container.innerHTML = projects.map(proj => `
        <div class="project-card">
            <div class="project-header">
                <h3>${proj.name}</h3>
                <span class="badge">${proj.role}</span>
                <span class="date">${proj.date}</span>
            </div>
            <div class="project-body">
                <ul>
                    ${proj.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function renderInternships(internships) {
    const container = document.getElementById('internship-list');
    container.innerHTML = internships.map(job => `
        <div class="timeline-item">
            <div class="content">
                <h3>${job.company}</h3>
                <p class="sub">${job.position}</p>
                <p class="desc">${job.desc}</p>
            </div>
        </div>
    `).join('');
}

function renderCampus(campus) {
    const container = document.getElementById('campus-list');
    container.innerHTML = campus.map(exp => `
        <div class="timeline-item">
            <div class="content">
                <h3>${exp.org}</h3>
                <p class="sub">${exp.role}</p>
                <p class="desc">${exp.desc}</p>
            </div>
        </div>
    `).join('');
}

function renderSkills(skills) {
    const container = document.getElementById('skills-list');
    
    const skillCategories = [
        { title: '语言能力', icon: 'fas fa-language', items: skills.languages },
        { title: '数据与科研', icon: 'fas fa-chart-bar', items: skills.data_research },
        { title: '设计与运营', icon: 'fas fa-palette', items: skills.design_ops }
    ];

    container.innerHTML = skillCategories.map(cat => `
        <div class="card skill-card">
            <h3><i class="${cat.icon}"></i> ${cat.title}</h3>
            ${cat.items.map(item => `<p>${item}</p>`).join('')}
        </div>
    `).join('');
}

function renderHonors(honors) {
    document.getElementById('honors-content').textContent = honors;
}

function renderInterests(interests) {
    document.getElementById('interests-content').textContent = interests;
}