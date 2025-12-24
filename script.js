// ========== LUMINOUS PRECISION - INTERACTIVE SYSTEM ==========

// ========== 导航栏滚动效果 ==========
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Performance metrics bar animation trigger
    if (currentScroll > 300) {
        document.querySelectorAll('.metric-fill').forEach(bar => {
            const width = bar.dataset.width || '85%';
            bar.style.width = width;
        });
    }

    // Chart bars animation
    if (currentScroll > 400) {
        document.querySelectorAll('.chart-bar').forEach(bar => {
            const width = bar.dataset.width || '0%';
            bar.style.width = width;
        });
    }

    lastScroll = currentScroll;
});

// ========== 移动端导航 ==========
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// 点击导航链接后关闭移动端菜单
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// ========== 英雄区域动画系统 ==========
// Staggered entrance animations for hero elements
function initHeroAnimations() {
    const heroElements = [
        '.hero-badge',
        '.hero-title',
        '.hero-subtitle',
        '.hero-stats',
        '.hero-cta'
    ];

    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';

            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 150 + (index * 150));
        }
    });

    // Scroll hint animation
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
        setTimeout(() => {
            scrollHint.style.opacity = '0.6';
            scrollHint.style.transform = 'translateX(-50%) translateY(0)';
        }, 1000);
    }
}

// ========== 滚动观察器 - 滚动触发动画 ==========
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger specific animations
            if (entry.target.classList.contains('feature-card')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }

            if (entry.target.classList.contains('perf-metric-card')) {
                const fill = entry.target.querySelector('.metric-fill');
                if (fill) {
                    const width = fill.dataset.width || '85%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 200);
                }
            }

            if (entry.target.classList.contains('timeline-item')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.feature-card, .perf-metric-card, .timeline-item, .tech-feature-item, .material-card').forEach(el => {
    observer.observe(el);
});

// ========== 性能数字滚动动画 ==========
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// 对性能数字应用滚动动画
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value, .metric-value, .mini-value');
            if (statValue && !statValue.classList.contains('animated')) {
                const textContent = statValue.textContent;
                // Extract number from text (handle cases like "2.36s", "960kW")
                const numberMatch = textContent.match(/[\d.]+/);
                if (numberMatch) {
                    const targetValue = parseFloat(numberMatch[0]);
                    statValue.classList.add('animated');

                    // Animate with proper formatting
                    if (textContent.includes('s') || textContent.includes('kW')) {
                        animateDecimalNumber(statValue, targetValue, textContent);
                    } else {
                        animateNumber(statValue, targetValue);
                    }
                }
            }
        }
    });
}, { threshold: 0.3 });

function animateDecimalNumber(element, target, suffix) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix.replace(/[\d.]+/, '');
            clearInterval(timer);
        } else {
            const displayValue = current.toFixed(suffix.includes('s') ? 2 : 0);
            element.textContent = displayValue + suffix.replace(/[\d.]+/, '');
        }
    }, 16);
}

document.querySelectorAll('.stat-card, .perf-metric-card, .mini-stat').forEach(card => {
    statObserver.observe(card);
});

// ========== 驾驶模式切换 ==========
const modeButtons = document.querySelectorAll('.mode-btn');
const modeDescription = document.getElementById('mode-desc');

const modeDescriptions = {
    'sport+': '赛道模式 - 释放全部性能，激活最激进的响应设置和最强下压力',
    'sport': '运动模式 - 动力响应灵敏，悬挂调校偏硬朗，适合激情驾驶',
    'comfort': '舒适模式 - 悬挂柔软，动力线性平顺，提供最佳乘坐舒适性',
    'eco': '节能模式 - 优化能耗表现，延长续航里程，适合日常通勤',
    'custom': '自定义模式 - 自由组合各项参数，打造专属驾驶体验'
};

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        modeButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Update description
        const mode = btn.dataset.mode;
        if (modeDescription && modeDescriptions[mode]) {
            modeDescription.style.opacity = '0';
            modeDescription.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                modeDescription.textContent = modeDescriptions[mode];
                modeDescription.style.transition = 'all 0.3s ease';
                modeDescription.style.opacity = '1';
                modeDescription.style.transform = 'translateY(0)';
            }, 150);
        }
    });
});

// ========== 平滑滚动 ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== 页面加载完成初始化 ==========
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Initialize hero animations
    if (document.querySelector('.hero-section')) {
        initHeroAnimations();
    }

    // Add visible class to elements already in viewport
    const initialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .section-header').forEach(el => {
        initialObserver.observe(el);
    });
});

// ========== 鼠标跟随光效（仅在桌面端） ==========
if (window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        // Apply subtle parallax to hero image
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            const offsetX = (currentX - window.innerWidth / 2) * 0.01;
            const offsetY = (currentY - window.innerHeight / 2) * 0.01;
            heroImage.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        }

        requestAnimationFrame(updateGlow);
    }

    // Only run if hero section exists
    if (document.querySelector('.hero-section')) {
        updateGlow();
    }
}

// ========== 视差滚动效果 ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Parallax for hero background
    const heroBg = document.querySelector('.hero-bg-wrapper');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // Parallax for various backgrounds
    document.querySelectorAll('.parallax-bg').forEach(el => {
        const speed = el.dataset.speed || 0.3;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========== 性能图表动画 ==========
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.chart-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.dataset.width || '0%';
                    bar.style.width = width;
                }, index * 100);
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.comparison-chart').forEach(chart => {
    chartObserver.observe(chart);
});

// ========== 材质卡片悬停效果增强 ==========
document.querySelectorAll('.material-showcase-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========== 科技特性行点击展开 ==========
document.querySelectorAll('.tech-feature-row').forEach(row => {
    row.addEventListener('click', function() {
        this.classList.toggle('expanded');
        const details = this.querySelector('.feature-details');
        if (details) {
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// ========== 窗口调整大小处理 ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize any responsive features here
        console.log('Window resized - responsive adjustments applied');
    }, 250);
});

// ========== 控制台签名 ==========
console.log('%c YANGWANG U9 ', 'background: #9d4edd; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px 20px;');
console.log('%c LUMINOUS PRECISION - Design System Active ', 'background: #0a0a0a; color: #9d4edd; font-size: 12px; padding: 5px 10px;');
console.log('Experience the future of hypercar performance and design.');
