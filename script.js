let currentLang = 'zh';

document.addEventListener('DOMContentLoaded', () => {
    // 初始化加载
    loadData(currentLang);

    // 语言切换
    const langBtn = document.getElementById('lang-btn');
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLangButton();
        loadData(currentLang);
    });

    // 平滑滚动
    setupSmoothScroll();
});

function setupSmoothScroll() {
    // 使用委托代理，因为导航链接是动态生成的
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

function updateLangButton() {
    const langText = document.getElementById('lang-text');
    langText.textContent = currentLang === 'zh' ? 'EN' : '中文';
}

function loadData(lang) {
    const filename = lang === 'zh' ? 'data.json' : 'data_en.json';
    fetch(filename)
        .then(response => response.json())
        .then(data => {
            renderNavbar(data.navbar);
            renderSectionTitles(data.section_titles);
            renderProfile(data.profile);
            renderEducation(data.education);
            renderResearch(data.research, data.section_titles);
            renderProjects(data.projects);
            renderInternships(data.internships);
            renderCampus(data.campus);
            renderSkills(data.skills, data.section_titles);
            renderHonors(data.honors);
            renderInterests(data.interests);
        })
        .catch(error => console.error('Error loading data:', error));
}

function renderNavbar(navbar) {
    const navLinks = document.getElementById('nav-links');
    navLinks.innerHTML = navbar.map(item => `
        <li><a href="#${item.id}">${item.text}</a></li>
    `).join('');
}

function renderSectionTitles(titles) {
    if (!titles) return;
    setText('title-education', titles.education);
    setText('title-research', titles.research);
    setText('title-papers', titles.papers);
    setText('title-patents', titles.patents);
    setText('title-projects', titles.projects);
    setText('title-internships', titles.internships);
    setText('title-campus', titles.campus);
    setText('title-skills', titles.skills);
    setText('title-honors', titles.honors);
    setText('title-interests', titles.interests);
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function renderProfile(profile) {
    document.getElementById('nav-logo').textContent = profile.name;
    const year = new Date().getFullYear();
    document.getElementById('footer-text').innerHTML = `&copy; ${year} ${profile.name}. All Rights Reserved.`;
    document.title = `${profile.name} | ${currentLang === 'zh' ? '个人主页' : 'Portfolio'}`;

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

function renderResearch(research, titles) {
    // 研究简介
    const introContainer = document.getElementById('research-intro');
    introContainer.innerHTML = `
        <h3>${titles ? titles.research_direction : '研究方向'}</h3>
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

function renderSkills(skills, titles) {
    const container = document.getElementById('skills-list');
    
    // 使用传入的 titles 或默认值
    const t = titles || {
        skills_lang: '语言能力',
        skills_data: '数据与科研',
        skills_design: '设计与运营'
    };

    const skillCategories = [
        { title: t.skills_lang, icon: 'fas fa-language', items: skills.languages },
        { title: t.skills_data, icon: 'fas fa-chart-bar', items: skills.data_research },
        { title: t.skills_design, icon: 'fas fa-palette', items: skills.design_ops }
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