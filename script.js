document.addEventListener('DOMContentLoaded', function() {
    const monthButtons = document.querySelectorAll('.month-btn');
    const monthSections = document.querySelectorAll('.month-section');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const checkboxes = document.querySelectorAll('.checkbox');
    const STORAGE_KEY = 'calendarCheckboxState';

    function showMonth(monthId) {
        monthSections.forEach(section => section.classList.remove('active'));
        monthButtons.forEach(button => button.classList.remove('active'));

        const targetSection = document.getElementById(monthId);
        const targetButton = document.querySelector(`.month-btn[data-month="${monthId}"]`);

        if (targetSection) targetSection.classList.add('active');
        if (targetButton) targetButton.classList.add('active');
    }
    
    function filterEvents(activeFilter) {
        const allItems = document.querySelectorAll('.calendar-item');
        
        allItems.forEach(item => {
            const itemInstitution = item.dataset.institution;
            if (activeFilter === 'all' || activeFilter === itemInstitution) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        monthSections.forEach(section => {
            const visibleItems = section.querySelectorAll('.calendar-item[style*="display: flex"]');
            const emptyMsg = section.querySelector('.empty-message');
            if (emptyMsg) {
                emptyMsg.classList.toggle('hidden', visibleItems.length > 0);
            }
        });
    }

    function handleCheckboxChange(e) {
        const checkbox = e.target;
        const calendarItem = checkbox.closest('.calendar-item');
        if (calendarItem) {
            calendarItem.classList.toggle('completed', checkbox.checked);
        }
        saveState();
    }

    function saveState() {
        const state = {};
        checkboxes.forEach(checkbox => {
            state[checkbox.id] = checkbox.checked;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function loadState() {
        const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        checkboxes.forEach(checkbox => {
            checkbox.checked = savedState[checkbox.id] || false;
            if (checkbox.checked) {
                const calendarItem = checkbox.closest('.calendar-item');
                if(calendarItem) calendarItem.classList.add('completed');
            }
        });
    }
    
    function initialize() {
        const monthNames = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        const currentYear = new Date().getFullYear();
        // Como as datas são de 2025, vamos fixar o mês inicial em setembro para demonstração
        const initialMonth = 'setembro'; 
        showMonth(initialMonth);

        monthButtons.forEach(button => {
            button.addEventListener('click', () => showMonth(button.dataset.month));
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterEvents(button.dataset.filter);
            });
        });

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });

        loadState();
        filterEvents('all');
    }

    initialize();
});