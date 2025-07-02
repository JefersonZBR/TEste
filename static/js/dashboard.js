// Enhanced Dashboard JavaScript functionality

// Chart configurations
let categoryChart, revenueChart, statusChart;

function initializeCharts(data) {
    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['IPTV', 'VPN'],
                datasets: [{
                    data: [data.iptv_count, data.vpn_count],
                    backgroundColor: [
                        'rgba(6, 182, 212, 0.8)',
                        'rgba(100, 116, 139, 0.8)'
                    ],
                    borderColor: [
                        '#06b6d4',
                        '#64748b'
                    ],
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f8fafc',
                            font: {
                                size: 14,
                                weight: '500'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        titleColor: '#f8fafc',
                        bodyColor: '#94a3b8',
                        borderColor: '#334155',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} clientes (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        revenueChart = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['IPTV', 'VPN'],
                datasets: [{
                    label: 'Receita (R$)',
                    data: [data.iptv_value, data.vpn_value],
                    backgroundColor: [
                        'rgba(6, 182, 212, 0.8)',
                        'rgba(100, 116, 139, 0.8)'
                    ],
                    borderColor: [
                        '#06b6d4',
                        '#64748b'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        titleColor: '#f8fafc',
                        bodyColor: '#94a3b8',
                        borderColor: '#334155',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: R$ ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Status Distribution Chart
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        statusChart = new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: ['Ativos', 'Vencendo', 'Expirados'],
                datasets: [{
                    data: [data.active_clients, data.expiring_clients, data.expired_clients],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f8fafc',
                            font: {
                                size: 14,
                                weight: '500'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        titleColor: '#f8fafc',
                        bodyColor: '#94a3b8',
                        borderColor: '#334155',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

// Auto-refresh dashboard data with enhanced loading states
function refreshDashboardData() {
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
        showLoading(refreshButton);
    }

    fetch('/api/dashboard-data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error loading dashboard data:', data.error);
                showNotification('Erro ao carregar dados', 'error');
                return;
            }

            // Update statistics cards with animation
            updateStatisticsCards(data);

            // Update charts
            updateCharts(data);

            // Show success notification
            showNotification('Dados atualizados com sucesso', 'success');
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            showNotification('Erro ao conectar com o servidor', 'error');
        })
        .finally(() => {
            if (refreshButton) {
                hideLoading(refreshButton);
            }
        });
}

function updateStatisticsCards(data) {
    // Update card values with smooth animation
    const updates = [
        { selector: '.total-clients-value', value: data.total_clients },
        { selector: '.total-value-amount', value: `R$ ${data.total_value.toFixed(2)}` },
        { selector: '.iptv-count', value: data.iptv_count },
        { selector: '.vpn-count', value: data.vpn_count },
        { selector: '.paid-clients', value: data.paid_clients },
        { selector: '.pending-clients', value: data.pending_clients }
    ];

    updates.forEach(update => {
        const element = document.querySelector(update.selector);
        if (element) {
            animateValue(element, element.textContent, update.value);
        }
    });
}

function animateValue(element, start, end) {
    const startValue = parseFloat(start.replace(/[^\d.-]/g, '')) || 0;
    const endValue = parseFloat(end.replace(/[^\d.-]/g, '')) || 0;
    const duration = 1000;
    const startTime = performance.now();

    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        if (end.includes('R$')) {
            element.textContent = `R$ ${currentValue.toFixed(2)}`;
        } else {
            element.textContent = Math.round(currentValue);
        }

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = end;
        }
    }

    requestAnimationFrame(updateValue);
}

function updateCharts(data) {
    // Update category chart
    if (categoryChart) {
        categoryChart.data.datasets[0].data = [data.iptv_count, data.vpn_count];
        categoryChart.update('active');
    }

    // Update revenue chart
    if (revenueChart) {
        revenueChart.data.datasets[0].data = [data.iptv_value, data.vpn_value];
        revenueChart.update('active');
    }

    // Update status chart
    if (statusChart) {
        statusChart.data.datasets[0].data = [data.active_clients, data.expiring_clients, data.expired_clients];
        statusChart.update('active');
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        border: none;
        border-radius: 12px;
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'error' ? 'exclamation-triangle-fill' : 'info-circle-fill'} me-2"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            const bsAlert = new bootstrap.Alert(notification);
            bsAlert.close();
        }
    }, 4000);
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up auto-refresh every 30 seconds
    const autoRefreshInterval = setInterval(refreshDashboardData, 30000);
    
    // Add refresh button functionality
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', refreshDashboardData);
    }

    // Enhanced card animations
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
    });

    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards for scroll animations
    cards.forEach(card => {
        observer.observe(card);
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + R for refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshDashboardData();
        }
    });

    // Add real-time clock
    updateClock();
    setInterval(updateClock, 1000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        clearInterval(autoRefreshInterval);
    });
});

function updateClock() {
    const clockElement = document.getElementById('currentTime');
    if (clockElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        clockElement.textContent = timeString;
    }
}

// Format currency values
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Enhanced loading states
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
        const originalText = element.innerHTML;
        element.dataset.originalText = originalText;
        element.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Carregando...';
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
        if (element.dataset.originalText) {
            element.innerHTML = element.dataset.originalText;
        }
    }
}

// Export dashboard data with enhanced features
function exportDashboardData() {
    showLoading(document.getElementById('exportButton'));
    
    fetch('/api/dashboard-data')
        .then(response => response.json())
        .then(data => {
            const exportData = {
                export_date: new Date().toISOString(),
                export_time: new Date().toLocaleString('pt-BR'),
                statistics: data,
                metadata: {
                    version: '1.0',
                    format: 'JSON',
                    encoding: 'UTF-8'
                }
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Dados exportados com sucesso', 'success');
        })
        .catch(error => {
            console.error('Error exporting data:', error);
            showNotification('Erro ao exportar dados', 'error');
        })
        .finally(() => {
            hideLoading(document.getElementById('exportButton'));
        });
}

// Performance monitoring
function measurePerformance() {
    if (performance.mark) {
        performance.mark('dashboard-load-start');
        
        window.addEventListener('load', function() {
            performance.mark('dashboard-load-end');
            performance.measure('dashboard-load', 'dashboard-load-start', 'dashboard-load-end');
            
            const measure = performance.getEntriesByName('dashboard-load')[0];
            console.log(`Dashboard loaded in ${measure.duration.toFixed(2)}ms`);
        });
    }
}

// Initialize performance monitoring
measurePerformance();

// Add CSS for spinning animation
const style = document.createElement('style');
style.textContent = `
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);