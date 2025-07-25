// Estado global de los cursos completados
let completedCourses = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));
// Estado global de notas
let courseGrades = JSON.parse(localStorage.getItem('courseGrades') || '{}');

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
    // Ya no mostrar la nota en la malla
    const notaDiv = courseElement.querySelector('.nota-materia');
    if (notaDiv) notaDiv.remove();
    const nameElement = courseElement.querySelector('.course-name');
    nameElement.textContent = courseData.name;
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
    localStorage.setItem('courseGrades', JSON.stringify(courseGrades));
}

// Descargar concentrado de notas
function downloadNotasPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text('Concentrado de Notas', 105, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    let rows = [];
    let total = 0;
    let count = 0;
    mallaData.semesters.forEach(sem => {
        sem.courses.forEach(course => {
            if (completedCourses.has(course.id)) {
                let nota = courseGrades[course.id] !== undefined ? courseGrades[course.id] : '';
                rows.push([course.id, course.name, nota]);
                if (nota !== '') {
                    total += parseFloat(nota);
                    count++;
                }
            }
        });
    });
    // Encabezados
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('ID', 20, y);
    doc.text('Materia', 50, y);
    doc.text('Nota promedio', 160, y);
    doc.setFont(undefined, 'normal');
    y += 7;
    // Filas
    rows.forEach(row => {
        doc.text(String(row[0]), 20, y);
        doc.text(String(row[1]), 50, y, { maxWidth: 100 });
        doc.text(String(row[2]), 160, y);
        y += 7;
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });
    // Promedio general
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Promedio general:', 50, y);
    doc.setFont(undefined, 'normal');
    let promedio = count > 0 ? (total / count).toFixed(2) : '-';
    doc.text(String(promedio), 120, y);
    doc.save('concentrado_notas.pdf');
}
// Modal para ingresar nota promedio
function showNotaModal(courseElement, courseData) {
    // Crear modal si no existe
    let modal = document.getElementById('notaModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'notaModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.4)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div style="background: #fff; padding: 24px 32px; border-radius: 8px; box-shadow: 0 2px 12px #0002; min-width: 300px; text-align: center;">
                <h3>Ingresa la nota promedio</h3>
                <input id="notaInput" type="number" min="10" max="70" step="1" inputmode="numeric" style="margin: 12px 0; width: 80px; font-size: 18px; padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc; appearance: textfield; -moz-appearance: textfield;" />
                <div style="margin-top: 10px;">
                    <button id="guardarNotaBtn" style="background: #4caf50; color: #fff; border: none; border-radius: 4px; padding: 6px 18px; font-size: 15px; cursor: pointer; margin-right: 10px;">Guardar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        // Ocultar flechas en todos los navegadores
        const style = document.createElement('style');
        style.textContent = `
            #notaInput::-webkit-outer-spin-button, #notaInput::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            #notaInput[type=number] {
                -moz-appearance: textfield;
            }
        `;
        document.head.appendChild(style);
    }
    // Mostrar modal
    modal.style.display = 'flex';
    const input = modal.querySelector('#notaInput');
    input.value = courseGrades[courseData.id] || '';
    input.focus();
    // Guardar
    modal.querySelector('#guardarNotaBtn').onclick = function() {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 10 || val > 70) {
            showToast('Ingresa una nota válida (10 a 70)');
            input.value = '';
            return;
        }
        courseGrades[courseData.id] = val;
        saveProgress();
        modal.style.display = 'none';
        // Actualizar input visual si existe
        document.querySelectorAll('.course').forEach(element => {
            const id = element.dataset.courseId;
            const semester = mallaData.semesters.find(sem => sem.courses.some(course => course.id === id));
            const course = semester.courses.find(course => course.id === id);
            updateCourseState(element, course);
        });
    };
    // Eliminar botón cancelar y evitar cerrar el modal sin nota válida
    modal.onclick = function(e) { e.stopPropagation(); };
    window.onkeydown = function(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
        }
    };
}
// Modificar handleCourseClick para mostrar el modal
function handleCourseClick(courseElement, courseData) {
    if (completedCourses.has(courseData.id)) {
        completedCourses.delete(courseData.id);
        delete courseGrades[courseData.id];
        updateCourseState(courseElement, courseData);
        showToast(`${courseData.name} marcada como pendiente`);
    } else if (canCompleteCourse(courseData)) {
        completedCourses.add(courseData.id);
        updateCourseState(courseElement, courseData);
        showToast(`${courseData.name} marcada como completada`);
        showNotaModal(courseElement, courseData);
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
    document.querySelectorAll('.course').forEach(element => {
        const id = element.dataset.courseId;
        const semester = mallaData.semesters.find(sem => 
            sem.courses.some(course => course.id === id)
        );
        const course = semester.courses.find(course => course.id === id);
        updateCourseState(element, course);
    });
}
// Eliminar input de nota debajo del ramo (ya no se usa)
function showGradeInput() {}

// Función para crear el elemento HTML de un curso
function createCourseElement(courseData) {
    const courseElement = document.createElement('div');
    courseElement.className = 'course';
    courseElement.dataset.courseId = courseData.id;
    
    const nameElement = document.createElement('div');
    nameElement.className = 'course-name';
    // Mostrar la nota si está completado
    if (completedCourses.has(courseData.id) && courseGrades[courseData.id] !== undefined) {
        nameElement.textContent = `${courseData.name} — Nota: ${courseGrades[courseData.id]}`;
    } else {
        nameElement.textContent = courseData.name;
    }
    
    const statusElement = document.createElement('div');
    statusElement.className = 'course-status';
    
    courseElement.appendChild(nameElement);
    courseElement.appendChild(statusElement);
    
    courseElement.addEventListener('click', () => handleCourseClick(courseElement, courseData));
    
    updateCourseState(courseElement, courseData);
    // Si está completado, mostrar input de nota
    if (completedCourses.has(courseData.id)) {
        showGradeInput(courseElement, courseData);
    }
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
    // Botón de descarga de notas
    const btn = document.getElementById('downloadNotasBtn');
    if (btn) {
        btn.addEventListener('click', downloadNotasPDF);
    }
}); 