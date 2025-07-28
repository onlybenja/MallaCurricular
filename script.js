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
    const wasDisabled = courseElement.classList.contains('disabled');
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
    // Animación de desbloqueo/bloqueo
    if (!isCompleted) {
        if (wasDisabled && canComplete) {
            courseElement.classList.add('unlocked');
            setTimeout(() => courseElement.classList.remove('unlocked'), 400);
        } else if (!wasDisabled && !canComplete) {
            courseElement.classList.add('locked');
            setTimeout(() => courseElement.classList.remove('locked'), 400);
        }
    }
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
function animateCourseElement(courseElement) {
    courseElement.classList.add('animated');
    setTimeout(() => {
        courseElement.classList.remove('animated');
    }, 320);
}
function animateUncheckCourseElement(courseElement) {
    courseElement.classList.add('unchecking');
    setTimeout(() => {
        courseElement.classList.remove('unchecking');
    }, 320);
}
function animatePrereqShake(courseElement) {
    courseElement.classList.add('prereq-shake');
    setTimeout(() => {
        courseElement.classList.remove('prereq-shake');
    }, 400);
}
// Modificar handleCourseClick para mostrar el modal
function handleCourseClick(courseElement, courseData) {
    if (completedCourses.has(courseData.id)) {
        // Desmarcar en cascada todas las que dependan de esta
        function desmarcarDependientes(id) {
            mallaData.semesters.forEach(sem => {
                sem.courses.forEach(course => {
                    if (completedCourses.has(course.id) && course.prerequisites.includes(id)) {
                        const depElement = document.querySelector(`.course[data-course-id='${course.id}']`);
                        if (depElement) animateUncheckCourseElement(depElement);
                        completedCourses.delete(course.id);
                        delete courseGrades[course.id];
                        // Buscar dependientes recursivamente
                        desmarcarDependientes(course.id);
                    }
                });
            });
        }
        completedCourses.delete(courseData.id);
        delete courseGrades[courseData.id];
        desmarcarDependientes(courseData.id);
        updateCourseState(courseElement, courseData);
        showToast(`${courseData.name} marcada como pendiente`);
        animateUncheckCourseElement(courseElement);
    } else if (canCompleteCourse(courseData)) {
        completedCourses.add(courseData.id);
        updateCourseState(courseElement, courseData);
        showToast(`${courseData.name} marcada como completada`);
        showNotaModal(courseElement, courseData);
        animateCourseElement(courseElement);
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
        animatePrereqShake(courseElement);
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
    // Tooltip de prerrequisitos
    if (courseData.prerequisites && courseData.prerequisites.length > 0) {
        courseElement.addEventListener('mouseenter', function(e) {
            let tooltip = document.createElement('div');
            tooltip.className = 'tooltip-prereq';
            const names = courseData.prerequisites.map(prereqId => {
                for (const sem of mallaData.semesters) {
                    const c = sem.courses.find(c => c.id === prereqId);
                    if (c) return c.name;
                }
                return prereqId;
            });
            tooltip.textContent = 'Prerrequisitos: ' + names.join(', ');
            document.body.appendChild(tooltip);
            const rect = courseElement.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width/2) + 'px';
            tooltip.style.top = (rect.top - 8) + 'px';
            setTimeout(() => { tooltip.classList.add('show'); }, 10);
            courseElement._tooltip = tooltip;
        });
        courseElement.addEventListener('mouseleave', function() {
            if (courseElement._tooltip) {
                courseElement._tooltip.remove();
                courseElement._tooltip = null;
            }
        });
    }
    // Si está completado, mostrar input de nota
    if (completedCourses.has(courseData.id)) {
        showGradeInput(courseElement, courseData);
    }
    return courseElement;
}

// Función para crear la malla curricular
function createMalla() {
    const container = document.getElementById('mallaContainer');
    
    // Crear contenedores para cada año
    for (let yearIndex = 0; yearIndex < Math.ceil(mallaData.semesters.length / 2); yearIndex++) {
        const yearContainer = document.createElement('div');
        yearContainer.className = 'year-container';
        
        // Título del año
        const yearNumber = yearIndex + 1;
        const yearTitle = document.createElement('div');
        yearTitle.className = 'year-title';
        yearTitle.textContent = `${yearNumber}° Año`;
        yearContainer.appendChild(yearTitle);
        
        // Contenedor para los semestres del año
        const semestersContainer = document.createElement('div');
        semestersContainer.className = 'semesters-container';
        
        // Agregar los dos semestres del año
        for (let i = 0; i < 2; i++) {
            const semesterIndex = yearIndex * 2 + i;
            if (semesterIndex < mallaData.semesters.length) {
                const semesterData = mallaData.semesters[semesterIndex];
                
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
                semestersContainer.appendChild(semesterElement);
            }
        }
        
        yearContainer.appendChild(semestersContainer);
        container.appendChild(yearContainer);
    }
}

// --- HORARIO ---
// Eliminar renderHorarioSection y llamadas relacionadas
// --- HORARIO VISUAL ---
const HORARIO_VISUAL_KEY = 'horarioVisualRamos';
function getHorarioVisualData() {
    return JSON.parse(localStorage.getItem(HORARIO_VISUAL_KEY) || '[]');
}
function saveHorarioVisualData(data) {
    localStorage.setItem(HORARIO_VISUAL_KEY, JSON.stringify(data));
}
const DIAS_VISUAL = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
// Reemplazar BLOQUES_VISUAL por los horarios exactos dados
const BLOQUES_VISUAL = [
    {inicio: '08:30', fin: '09:10', ventana: false},
    {inicio: '09:10', fin: '09:50', ventana: false},
    {inicio: '09:50', fin: '10:00', ventana: true},
    {inicio: '10:00', fin: '10:40', ventana: false},
    {inicio: '10:40', fin: '11:20', ventana: false},
    {inicio: '11:20', fin: '11:30', ventana: true},
    {inicio: '11:30', fin: '12:10', ventana: false},
    {inicio: '12:10', fin: '12:50', ventana: false},
    {inicio: '12:50', fin: '13:10', ventana: true},
    {inicio: '13:10', fin: '13:50', ventana: false},
    {inicio: '13:50', fin: '14:30', ventana: false},
    {inicio: '14:30', fin: '14:40', ventana: true},
    {inicio: '14:40', fin: '15:20', ventana: false},
    {inicio: '15:20', fin: '16:00', ventana: false},
    {inicio: '16:00', fin: '16:10', ventana: true},
    {inicio: '16:10', fin: '16:50', ventana: false},
    {inicio: '16:50', fin: '17:30', ventana: false},
    {inicio: '17:30', fin: '18:10', ventana: false},
    {inicio: '18:10', fin: '18:30', ventana: true},
    {inicio: '18:30', fin: '19:10', ventana: false},
];
// --- SELECTOR DE SEMESTRE PARA HORARIO VISUAL ---
let semestreVisualSeleccionado = 1;
let modoEdicionHorario = false;
function renderSelectorSemestreVisual() {
    const container = document.getElementById('selectorSemestreVisualContainer');
    container.innerHTML = '';
    const label = document.createElement('label');
    label.textContent = 'Ver horario de: ';
    const select = document.createElement('select');
    for (let i = 1; i <= mallaData.semesters.length; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${i}° Semestre`;
        if (i === semestreVisualSeleccionado) opt.selected = true;
        select.appendChild(opt);
    }
    select.onchange = function() {
        semestreVisualSeleccionado = parseInt(this.value);
        renderHorarioVisualSection();
    };
    container.appendChild(label);
    container.appendChild(select);
}
// --- FIN SELECTOR ---
// Modificar renderHorarioVisualSection para la nueva lógica de impares/pares
function renderHorarioVisualSection() {
    renderSelectorSemestreVisual();
    const section = document.getElementById('horarioVisualSection');
    section.innerHTML = '';
    const semestre = mallaData.semesters[semestreVisualSeleccionado-1];
    if (!semestre) {
        section.innerHTML = '<h2 class="horario-titulo-rosa">Horario visual semanal</h2><p style="text-align:center;">¡Ya aprobaste todos los ramos!</p>';
        return;
    }
    // Botón editar (ahora se renderiza en la cabecera)
    const editarBtn = document.getElementById('editarHorarioBtn');
    if (editarBtn) {
        editarBtn.innerHTML = modoEdicionHorario ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><polyline points="20 6 9 17 4 12"/></svg>Listo' : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>Editar';
        editarBtn.onclick = () => {
            modoEdicionHorario = !modoEdicionHorario;
            renderHorarioVisualSection();
        };
    }
    function prereqsAprobados(course) {
        return course.prerequisites.length === 0 || course.prerequisites.every(pr => completedCourses.has(pr));
    }
    // Materias del semestre seleccionado
    const materiasSemestre = semestre.courses.filter(c => !completedCourses.has(c.id) && prereqsAprobados(c));
    // Materias de semestres anteriores no aprobadas y con prerrequisitos aprobados, SOLO si cumplen la regla de paridad
    let materiasPrevias = [];
    for (let s = 0; s < semestreVisualSeleccionado-1; s++) {
        // Solo considerar ramos de semestres con la misma paridad
        if ((s+1) % 2 === semestreVisualSeleccionado % 2) {
            mallaData.semesters[s].courses.forEach(c => {
                if (!completedCourses.has(c.id) && prereqsAprobados(c)) {
                    if (!materiasPrevias.some(m => m.id === c.id)) materiasPrevias.push(c);
                }
            });
        }
    }
    const materiasNoAprobadas = [...materiasPrevias, ...materiasSemestre];
    // Verificar si hay alguna materia asignada en el horario
    const horarioDataAll = getHorarioVisualData();
    let horarioData = horarioDataAll.find(h => h.semestre === semestreVisualSeleccionado);
    if (!horarioData) {
        horarioData = { semestre: semestreVisualSeleccionado, bloques: [] };
        horarioDataAll.push(horarioData);
        saveHorarioVisualData(horarioDataAll);
    }
    // Contenedor principal
    const container = document.createElement('div');
    container.className = 'horario-visual-container' + (modoEdicionHorario ? '' : ' no-edit');
    // Lista de materias
    const lista = document.createElement('div');
    lista.className = 'horario-materias-lista';
    lista.innerHTML = '<h3>Materias</h3>';
    materiasNoAprobadas.forEach(m => {
        const matDiv = document.createElement('div');
        matDiv.className = 'materia-draggable';
        matDiv.textContent = m.name;
        matDiv.draggable = true;
        matDiv.dataset.materiaId = m.id;
        matDiv.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', m.id);
        });
        lista.appendChild(matDiv);
    });
    container.appendChild(lista);
    // Cuadrícula
    const grid = document.createElement('div');
    grid.className = 'horario-visual-grid';
    const table = document.createElement('table');
    table.className = 'horario-visual-table';
    // Encabezado
    let thead = '<thead><tr><th class="hora-super">Hora</th>';
    for (const dia of DIAS_VISUAL) thead += `<th>${dia}</th>`;
    thead += '</tr></thead>';
    table.innerHTML = thead;
    // Cuerpo
    let tbody = '<tbody>';
    BLOQUES_VISUAL.forEach((bloque, i) => {
        tbody += '<tr>';
        // Etiqueta de hora
        if (!bloque.ventana) {
            tbody += `<td class="hora-label">${bloque.inicio}<br>-<br>${bloque.fin}</td>`;
        } else {
            tbody += `<td class="hora-label" style="background:#f3e5f5;color:#ad1457;font-size:0.95em;">${bloque.inicio}-${bloque.fin}</td>`;
        }
        for (let d = 0; d < DIAS_VISUAL.length; d++) {
            if (bloque.ventana) {
                tbody += '<td class="bloque-horario ventana"></td>';
            } else {
                const asignado = horarioData.bloques.find(h => h.dia === DIAS_VISUAL[d] && h.inicio === bloque.inicio && h.fin === bloque.fin);
                tbody += `<td class="bloque-horario" data-dia="${DIAS_VISUAL[d]}" data-inicio="${bloque.inicio}" data-fin="${bloque.fin}">`;
                if (asignado && materiasNoAprobadas.some(m => m.id === asignado.materia)) {
                    const mat = materiasNoAprobadas.find(m => m.id === asignado.materia);
                    tbody += `<span class="materia-asignada" draggable="true" data-materia-id="${mat.id}" title="${mat.name}">${mat.name}</span>`;
                }
                tbody += '</td>';
            }
        }
        tbody += '</tr>';
    });
    tbody += '</tbody>';
    table.innerHTML += tbody;
    grid.appendChild(table);
    container.appendChild(grid);
    section.appendChild(container);
    // Drag & drop lógica SOLO si modoEdicionHorario
    if (modoEdicionHorario) {
        // Arrastrar desde lista
        section.querySelectorAll('.materia-draggable').forEach(el => {
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', el.dataset.materiaId);
            });
            
            // Soporte para touch en móviles
            let touchStartX, touchStartY, isDragging = false;
            
            el.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isDragging = false;
            });
            
            el.addEventListener('touchmove', e => {
                if (!isDragging) {
                    const touchX = e.touches[0].clientX;
                    const touchY = e.touches[0].clientY;
                    const deltaX = Math.abs(touchX - touchStartX);
                    const deltaY = Math.abs(touchY - touchStartY);
                    
                    if (deltaX > 10 || deltaY > 10) {
                        isDragging = true;
                        e.preventDefault();
                        // Crear un elemento fantasma muy visible para el drag visual
                        const ghost = document.createElement('div');
                        ghost.textContent = el.textContent;
                        ghost.style.position = 'fixed';
                        ghost.style.top = touchY - 30 + 'px';
                        ghost.style.left = touchX - 30 + 'px';
                        ghost.style.zIndex = '50000';
                        ghost.style.opacity = '1';
                        ghost.style.pointerEvents = 'none';
                        ghost.style.transform = 'scale(1.2)';
                        ghost.style.boxShadow = '0 10px 30px rgba(216, 27, 96, 0.6)';
                        ghost.style.border = '3px solid #d81b60';
                        ghost.style.borderRadius = '10px';
                        ghost.style.background = '#d81b60';
                        ghost.style.color = 'white';
                        ghost.style.padding = '8px 12px';
                        ghost.style.fontSize = '14px';
                        ghost.style.fontWeight = 'bold';
                        ghost.style.minWidth = '100px';
                        ghost.style.textAlign = 'center';
                        ghost.style.whiteSpace = 'nowrap';
                        ghost.style.transition = 'none';
                        document.body.appendChild(ghost);
                        el._ghost = ghost;
                        el._draggedMateriaId = el.dataset.materiaId;
                        
                        // Agregar indicador de arrastre
                        const dragIndicator = document.createElement('div');
                        dragIndicator.className = 'drag-indicator';
                        dragIndicator.style.position = 'fixed';
                        dragIndicator.style.top = touchY + 15 + 'px';
                        dragIndicator.style.left = touchX - 10 + 'px';
                        dragIndicator.style.width = '20px';
                        dragIndicator.style.height = '20px';
                        dragIndicator.style.background = 'rgba(216, 27, 96, 0.8)';
                        dragIndicator.style.borderRadius = '50%';
                        dragIndicator.style.zIndex = '49999';
                        dragIndicator.style.pointerEvents = 'none';
                        dragIndicator.style.boxShadow = '0 2px 8px rgba(216, 27, 96, 0.3)';
                        document.body.appendChild(dragIndicator);
                        el._dragIndicator = dragIndicator;
                    }
                } else {
                    e.preventDefault();
                    if (el._ghost) {
                        el._ghost.style.top = e.touches[0].clientY - 30 + 'px';
                        el._ghost.style.left = e.touches[0].clientX - 30 + 'px';
                    }
                    if (el._dragIndicator) {
                        el._dragIndicator.style.top = e.touches[0].clientY + 20 + 'px';
                        el._dragIndicator.style.left = e.touches[0].clientX - 10 + 'px';
                    }
                    
                    // Resaltar bloques cercanos
                    const touchX = e.touches[0].clientX;
                    const touchY = e.touches[0].clientY;
                    const bloques = section.querySelectorAll('.bloque-horario:not(.ventana)');
                    
                    bloques.forEach(bloque => {
                        const rect = bloque.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        const distance = Math.sqrt((touchX - centerX) ** 2 + (touchY - centerY) ** 2);
                        
                        if (distance < 80) {
                            bloque.classList.add('drag-hover');
                            bloque.style.transform = 'scale(1.05)';
                            bloque.style.boxShadow = '0 4px 15px rgba(216, 27, 96, 0.3)';
                            bloque.style.border = '2px solid rgba(216, 27, 96, 0.5)';
                        } else {
                            bloque.classList.remove('drag-hover');
                            bloque.style.transform = '';
                            bloque.style.boxShadow = '';
                            bloque.style.border = '';
                        }
                    });
                }
            });
            
            el.addEventListener('touchend', e => {
                if (isDragging && el._ghost) {
                    const touchX = e.changedTouches[0].clientX;
                    const touchY = e.changedTouches[0].clientY;
                    
                    // Limpiar efectos visuales de todos los bloques
                    const bloques = section.querySelectorAll('.bloque-horario');
                    bloques.forEach(bloque => {
                        bloque.classList.remove('drag-hover');
                        bloque.style.transform = '';
                        bloque.style.boxShadow = '';
                        bloque.style.border = '';
                    });
                    
                    // Buscar el bloque más cercano
                    const bloquesDisponibles = section.querySelectorAll('.bloque-horario:not(.ventana)');
                    let closestBloque = null;
                    let minDistance = Infinity;
                    
                    bloquesDisponibles.forEach(bloque => {
                        const rect = bloque.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        const distance = Math.sqrt((touchX - centerX) ** 2 + (touchY - centerY) ** 2);
                        
                        if (distance < minDistance && distance < 100) {
                            minDistance = distance;
                            closestBloque = bloque;
                        }
                    });
                    
                    if (closestBloque) {
                        const materiaId = el._draggedMateriaId;
                        if (!materiasNoAprobadas.some(m => m.id === materiaId)) return;
                        
                        // No permitir solapamiento
                        if (horarioData.bloques.some(h => h.materia === materiaId && h.dia === closestBloque.dataset.dia && (
                            (closestBloque.dataset.inicio >= h.inicio && closestBloque.dataset.inicio < h.fin) || 
                            (closestBloque.dataset.fin > h.inicio && closestBloque.dataset.fin <= h.fin) || 
                            (closestBloque.dataset.inicio <= h.inicio && closestBloque.dataset.fin >= h.fin)
                        ))) {
                            showToast('Ese horario se traslapa con otro de la misma materia');
                        } else {
                            // Si ya hay materia en ese bloque, reemplazar
                            const idx = horarioData.bloques.findIndex(h => h.dia === closestBloque.dataset.dia && h.inicio === closestBloque.dataset.inicio && h.fin === closestBloque.dataset.fin);
                            if (idx !== -1) horarioData.bloques.splice(idx, 1);
                            horarioData.bloques.push({ 
                                materia: materiaId, 
                                dia: closestBloque.dataset.dia, 
                                inicio: closestBloque.dataset.inicio, 
                                fin: closestBloque.dataset.fin 
                            });
                            saveHorarioVisualData(horarioDataAll);
                            renderHorarioVisualSection();
                        }
                    }
                    
                    // Limpiar elementos visuales
                    if (el._ghost) {
                        document.body.removeChild(el._ghost);
                        el._ghost = null;
                    }
                    if (el._dragIndicator) {
                        document.body.removeChild(el._dragIndicator);
                        el._dragIndicator = null;
                    }
                    el._draggedMateriaId = null;
                }
                isDragging = false;
            });
        });
        
        // Arrastrar materia ya asignada
        section.querySelectorAll('.materia-asignada').forEach(el => {
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', el.dataset.materiaId);
                // Guardar referencia al bloque original
                el._draggedFrom = el.closest('.bloque-horario');
            });
            
            // Soporte para touch en materias asignadas
            let touchStartX, touchStartY, isDragging = false;
            
            el.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isDragging = false;
                el._draggedFrom = el.closest('.bloque-horario');
            });
            
            el.addEventListener('touchmove', e => {
                if (!isDragging) {
                    const touchX = e.touches[0].clientX;
                    const touchY = e.touches[0].clientY;
                    const deltaX = Math.abs(touchX - touchStartX);
                    const deltaY = Math.abs(touchY - touchStartY);
                    
                    if (deltaX > 10 || deltaY > 10) {
                        isDragging = true;
                        e.preventDefault();
                        // Crear elemento fantasma muy visible
                        const ghost = document.createElement('div');
                        ghost.textContent = el.textContent;
                        ghost.style.position = 'fixed';
                        ghost.style.top = touchY - 30 + 'px';
                        ghost.style.left = touchX - 30 + 'px';
                        ghost.style.zIndex = '50000';
                        ghost.style.opacity = '1';
                        ghost.style.pointerEvents = 'none';
                        ghost.style.transform = 'scale(1.2)';
                        ghost.style.boxShadow = '0 10px 30px rgba(216, 27, 96, 0.6)';
                        ghost.style.border = '3px solid #d81b60';
                        ghost.style.borderRadius = '10px';
                        ghost.style.background = '#d81b60';
                        ghost.style.color = 'white';
                        ghost.style.padding = '8px 12px';
                        ghost.style.fontSize = '14px';
                        ghost.style.fontWeight = 'bold';
                        ghost.style.minWidth = '100px';
                        ghost.style.textAlign = 'center';
                        ghost.style.whiteSpace = 'nowrap';
                        ghost.style.transition = 'none';
                        document.body.appendChild(ghost);
                        el._ghost = ghost;
                    }
                } else {
                    e.preventDefault();
                    if (el._ghost) {
                        el._ghost.style.top = e.touches[0].clientY - 30 + 'px';
                        el._ghost.style.left = e.touches[0].clientX - 30 + 'px';
                    }
                }
            });
            
            el.addEventListener('touchend', e => {
                if (isDragging && el._ghost) {
                    const rect = section.querySelector('.horario-visual-grid').getBoundingClientRect();
                    const touchX = e.changedTouches[0].clientX;
                    const touchY = e.changedTouches[0].clientY;
                    
                    if (touchX < rect.left || touchX > rect.right || touchY < rect.top || touchY > rect.bottom) {
                        // Eliminar asignación
                        const materiaId = el.dataset.materiaId;
                        const parent = el._draggedFrom;
                        if (parent) {
                            const dia = parent.dataset.dia, inicio = parent.dataset.inicio, fin = parent.dataset.fin;
                            const idx = horarioData.bloques.findIndex(h => h.materia === materiaId && h.dia === dia && h.inicio === inicio && h.fin === fin);
                            if (idx !== -1) {
                                horarioData.bloques.splice(idx, 1);
                                saveHorarioVisualData(horarioDataAll);
                                renderHorarioVisualSection();
                            }
                        }
                    }
                    
                    document.body.removeChild(el._ghost);
                    el._ghost = null;
                }
                isDragging = false;
            });
            
            el.addEventListener('dragend', e => {
                const rect = section.querySelector('.horario-visual-grid').getBoundingClientRect();
                if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                    // Eliminar asignación
                    const materiaId = el.dataset.materiaId;
                    const parent = el._draggedFrom;
                    if (parent) {
                        const dia = parent.dataset.dia, inicio = parent.dataset.inicio, fin = parent.dataset.fin;
                        const idx = horarioData.bloques.findIndex(h => h.materia === materiaId && h.dia === dia && h.inicio === inicio && h.fin === fin);
                        if (idx !== -1) {
                            horarioData.bloques.splice(idx, 1);
                            saveHorarioVisualData(horarioDataAll);
                            renderHorarioVisualSection();
                        }
                    }
                }
            });
        });
        
        // Drop en bloques
        section.querySelectorAll('.bloque-horario:not(.ventana)').forEach(bloque => {
            bloque.addEventListener('dragover', e => {
                e.preventDefault();
                bloque.classList.add('drop-hover');
            });
            bloque.addEventListener('dragleave', e => {
                bloque.classList.remove('drop-hover');
            });
            bloque.addEventListener('drop', e => {
                e.preventDefault();
                bloque.classList.remove('drop-hover');
                const materiaId = e.dataTransfer.getData('text/plain');
                if (!materiasNoAprobadas.some(m => m.id === materiaId)) return;
                // No permitir solapamiento
                if (horarioData.bloques.some(h => h.materia === materiaId && h.dia === bloque.dataset.dia && (
                    (bloque.dataset.inicio >= h.inicio && bloque.dataset.inicio < h.fin) || (bloque.dataset.fin > h.inicio && bloque.dataset.fin <= h.fin) || (bloque.dataset.inicio <= h.inicio && bloque.dataset.fin >= h.fin)
                ))) {
                    showToast('Ese horario se traslapa con otro de la misma materia');
                    return;
                }
                // Si ya hay materia en ese bloque, reemplazar
                const idx = horarioData.bloques.findIndex(h => h.dia === bloque.dataset.dia && h.inicio === bloque.dataset.inicio && h.fin === bloque.dataset.fin);
                if (idx !== -1) horarioData.bloques.splice(idx, 1);
                horarioData.bloques.push({ materia: materiaId, dia: bloque.dataset.dia, inicio: bloque.dataset.inicio, fin: bloque.dataset.fin });
                saveHorarioVisualData(horarioDataAll);
                renderHorarioVisualSection();
            });
        });
    }
}
// Actualizar horario visual cuando cambia el estado de materias
const oldUpdateProgress2 = updateProgress;
updateProgress = function() {
    oldUpdateProgress2();
    renderHorarioVisualSection();
};
// Inicialización: renderizar horario visual al cargar
renderSelectorSemestreVisual();
renderHorarioVisualSection();

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    createMalla();
    updateProgress();
    // Botón de descarga de notas
    const btn = document.getElementById('downloadNotasBtn');
    if (btn) {
        btn.addEventListener('click', downloadNotasPDF);
    }
    // Modal de horario visual
    const horarioBtn = document.getElementById('toggleHorarioBtn');
    const horarioModal = document.getElementById('horarioVisualModal');
    const closeHorarioBtn = document.getElementById('closeHorarioModalBtn');
    const descargarHorarioJpgBtn = document.getElementById('descargarHorarioJpgBtn');
    if (horarioBtn && horarioModal && closeHorarioBtn) {
        horarioBtn.addEventListener('click', () => {
            horarioModal.classList.add('active');
        });
        closeHorarioBtn.addEventListener('click', () => {
            horarioModal.classList.remove('active');
        });
        // Cerrar al hacer clic fuera del contenido
        horarioModal.addEventListener('click', (e) => {
            if (e.target === horarioModal) {
                horarioModal.classList.remove('active');
            }
        });
    }
    if (descargarHorarioJpgBtn) {
        descargarHorarioJpgBtn.onclick = async () => {
            const grid = document.querySelector('.horario-visual-grid');
            if (!grid) return;
            const table = grid.querySelector('table');
            if (!table) return;
            // Verificar si hay materias asignadas
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            let hayMateria = false;
            for (const row of rows) {
                if (row.querySelector('.materia-asignada')) { hayMateria = true; break; }
            }
            if (!hayMateria) {
                return;
            }
            // Ocultar filas vacías al final
            const originalDisplay = rows.map(r => r.style.display);
            let lastRowWithMateria = -1;
            rows.forEach((row, i) => {
                if (row.querySelector('.materia-asignada')) lastRowWithMateria = i;
            });
            for (let i = lastRowWithMateria + 1; i < rows.length; i++) {
                rows[i].style.display = 'none';
            }
            // Ocultar columna de Sábado si no hay materias
            const colIndexSabado = 6; // 0:hora, 1:Lunes, ..., 6:Sabado
            let sabadoTieneMateria = false;
            for (let i = 0; i <= lastRowWithMateria; i++) {
                const celdas = rows[i].children;
                if (celdas[colIndexSabado] && celdas[colIndexSabado].querySelector('.materia-asignada')) {
                    sabadoTieneMateria = true;
                    break;
                }
            }
            let originalSabadoDisplay = [];
            if (!sabadoTieneMateria) {
                // Ocultar th de Sábado
                const ths = table.querySelectorAll('thead th');
                if (ths[colIndexSabado]) {
                    originalSabadoDisplay[0] = ths[colIndexSabado].style.display;
                    ths[colIndexSabado].style.display = 'none';
                }
                // Ocultar td de Sábado en cada fila
                for (let i = 0; i < rows.length; i++) {
                    const celdas = rows[i].children;
                    if (celdas[colIndexSabado]) {
                        originalSabadoDisplay[i+1] = celdas[colIndexSabado].style.display;
                        celdas[colIndexSabado].style.display = 'none';
                    }
                }
            }
            descargarHorarioJpgBtn.disabled = true;
            descargarHorarioJpgBtn.textContent = 'Generando...';
            await new Promise(r => setTimeout(r, 100));
            window.html2canvas(grid, {backgroundColor: '#fff', scale: 2}).then(canvas => {
                // Restaurar visibilidad
                rows.forEach((row, i) => { row.style.display = originalDisplay[i]; });
                if (!sabadoTieneMateria) {
                    const ths = table.querySelectorAll('thead th');
                    if (ths[colIndexSabado]) ths[colIndexSabado].style.display = originalSabadoDisplay[0] || '';
                    for (let i = 0; i < rows.length; i++) {
                        const celdas = rows[i].children;
                        if (celdas[colIndexSabado]) celdas[colIndexSabado].style.display = originalSabadoDisplay[i+1] || '';
                    }
                }
                const link = document.createElement('a');
                link.download = `horario_semestre_${semestreVisualSeleccionado}.jpg`;
                link.href = canvas.toDataURL('image/jpeg', 0.98);
                link.click();
                descargarHorarioJpgBtn.disabled = false;
                descargarHorarioJpgBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 17v-6h8v6"/><path d="M8 13h8"/></svg>Descargar JPG';
            });
        };
    }
    // Ocultar la sección y selector fuera del modal
    document.getElementById('horarioVisualSection').classList.add('active');
    document.getElementById('selectorSemestreVisualContainer').classList.add('active');
}); 