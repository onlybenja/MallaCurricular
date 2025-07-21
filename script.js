// Estado global de los cursos completados
let completedCourses = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));

// Función para mostrar mensajes toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Función para mostrar el modal de felicitación
function showCongratsModal() {
    const modal = document.getElementById('congratsModal');
    const modalBody = modal.querySelector('.modal-body');
    const congratsMessage = `
        <h2>¡Felicitaciones amor! 💖</h2>
        <p>Me enorgullece verte alcanzar una meta mas. Siempre supe que lo lograrías ya que eres una persona increíblemente inteligente, dedicada y perseverante.</p>
        <p>A partir de ahora comienza de un camino lleno de éxitos. Ahora vienen todas las cosas buenas y recompensas.</p>
        <p>Te amo infinitamente y estoy inmensamente orgulloso de ti.💝</p>
        <p>Te amo mucho amorcito</p>
    `;
    modalBody.innerHTML = congratsMessage;
    modal.classList.add('show');

    // Configurar el botón de cierre
    const closeButton = modal.querySelector('.close-button');
    closeButton.onclick = function() {
        modal.classList.remove('show');
    };

    // Cerrar el modal al hacer clic fuera de él
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };
}

// Función para verificar si un curso puede ser marcado como completado
function canCompleteCourse(course) {
    if (course.prerequisites.length === 0) return true;
    return course.prerequisites.every(prereq => completedCourses.has(prereq));
}

// Función para actualizar el estado visual de un curso
function updateCourseState(courseElement, courseData) {
    const isCompleted = completedCourses.has(courseData.id);
    const canComplete = canCompleteCourse(courseData);
    
    courseElement.classList.toggle('completed', isCompleted);
    courseElement.classList.toggle('disabled', !canComplete && !isCompleted);
    
    const statusElement = courseElement.querySelector('.course-status');
    statusElement.textContent = isCompleted ? '✓' : '';
}

// Función para verificar si se completaron todas las materias
function checkAllCoursesCompleted() {
    const totalCourses = mallaData.semesters.reduce((total, semester) => total + semester.courses.length, 0);
    if (completedCourses.size === totalCourses) {
        showCongratsModal();
    }
}

// Función para actualizar el progreso total
function updateProgress() {
    const totalCourses = mallaData.semesters.reduce((total, semester) => total + semester.courses.length, 0);
    const completedCount = completedCourses.size;
    const percentage = Math.round((completedCount / totalCourses) * 100);
    
    document.getElementById('totalProgress').style.width = `${percentage}%`;
    document.getElementById('progressPercentage').textContent = `${percentage}%`;
    
    checkAllCoursesCompleted();
}

// Función para guardar el progreso en localStorage
function saveProgress() {
    localStorage.setItem('completedCourses', JSON.stringify(Array.from(completedCourses)));
}

// Función para manejar el clic en un curso
function handleCourseClick(courseElement, courseData) {
    if (completedCourses.has(courseData.id)) {
        completedCourses.delete(courseData.id);
        updateCourseState(courseElement, courseData);
        showToast(`${courseData.name} marcada como pendiente`);
    } else if (canCompleteCourse(courseData)) {
        completedCourses.add(courseData.id);
        updateCourseState(courseElement, courseData);
        showToast(`${courseData.name} marcada como completada`);
    } else {
        const missingPrereqs = courseData.prerequisites
            .filter(prereq => !completedCourses.has(prereq))
            .map(prereq => {
                const semesterData = mallaData.semesters.find(sem => 
                    sem.courses.some(course => course.id === prereq)
                );
                const course = semesterData.courses.find(course => course.id === prereq);
                return course.name;
            });
        showToast(`Debes aprobar primero: ${missingPrereqs.join(', ')}`);
    }
    
    saveProgress();
    updateProgress();
    
    // Actualizar el estado de todos los cursos
    document.querySelectorAll('.course').forEach(element => {
        const id = element.dataset.courseId;
        const semester = mallaData.semesters.find(sem => 
            sem.courses.some(course => course.id === id)
        );
        const course = semester.courses.find(course => course.id === id);
        updateCourseState(element, course);
    });
}

// Función para crear el elemento HTML de un curso
function createCourseElement(courseData) {
    const courseElement = document.createElement('div');
    courseElement.className = 'course';
    courseElement.dataset.courseId = courseData.id;
    
    const nameElement = document.createElement('div');
    nameElement.className = 'course-name';
    nameElement.textContent = courseData.name;
    
    const statusElement = document.createElement('div');
    statusElement.className = 'course-status';
    
    courseElement.appendChild(nameElement);
    courseElement.appendChild(statusElement);
    
    courseElement.addEventListener('click', () => handleCourseClick(courseElement, courseData));
    
    updateCourseState(courseElement, courseData);
    return courseElement;
}

// Función para crear la malla curricular
function createMalla() {
    const container = document.getElementById('mallaContainer');
    
    mallaData.semesters.forEach(semesterData => {
        const semesterElement = document.createElement('div');
        semesterElement.className = 'semester';
        
        const titleElement = document.createElement('h2');
        titleElement.className = 'semester-title';
        titleElement.textContent = `${semesterData.number}° Semestre`;
        
        const coursesGrid = document.createElement('div');
        coursesGrid.className = 'courses-grid';
        
        semesterData.courses.forEach(courseData => {
            const courseElement = createCourseElement(courseData);
            coursesGrid.appendChild(courseElement);
        });
        
        semesterElement.appendChild(titleElement);
        semesterElement.appendChild(coursesGrid);
        container.appendChild(semesterElement);
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    createMalla();
    updateProgress();
}); 