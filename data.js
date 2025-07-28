const mallaData = {
    semesters: [
        {
            number: 1,
            courses: [
                { id: 'BIO101', name: 'Biología Celular', prerequisites: [] },
                { id: 'MOR101', name: 'Morfología Micro y Macroscópica I', prerequisites: [] },
                { id: 'MAT101', name: 'Matemáticas', prerequisites: [] },
                { id: 'INT101', name: 'Introducción a la Medicina Veterinaria', prerequisites: [] },
                { id: 'ING101', name: 'Inglés I', prerequisites: [] },
                { id: 'HAB101', name: 'Habilidades Académicas I', prerequisites: [] }
            ]
        },
        {
            number: 2,
            courses: [
                { id: 'QUI201', name: 'Química y Bioquímica para la Vida', prerequisites: ['BIO101'] },
                { id: 'MOR201', name: 'Morfología Micro y Macroscópica II', prerequisites: ['MOR101'] },
                { id: 'GEN201', name: 'Genética Animal', prerequisites: ['MAT101'] },
                { id: 'ZOO201', name: 'Zoología', prerequisites: [] },
                { id: 'ING201', name: 'Inglés II', prerequisites: ['ING101'] },
                { id: 'HAB201', name: 'Habilidades Académicas II', prerequisites: ['HAB101'] }
            ]
        },
        {
            number: 3,
            courses: [
                { id: 'FIS301', name: 'Fisiología y Fisiopatología I', prerequisites: ['QUI201'] },
                { id: 'AGE301', name: 'Agentes Biológicos de Enfermedad', prerequisites: [] },
                { id: 'BIO301', name: 'Bioestadística', prerequisites: ['MAT101'] },
                { id: 'ADM301', name: 'Administración de Empresas', prerequisites: [] },
                { id: 'ECO301', name: 'Ecología', prerequisites: ['ZOO201'] },
                { id: 'ING301', name: 'Inglés III', prerequisites: ['ING201'] },
                { id: 'ETI301', name: 'Ética y Ciudadanía', prerequisites: [] },
            ]
        },
        {
            number: 4,
            courses: [
                { id: 'FIS401', name: 'Fisiología y Fisiopatología II', prerequisites: ['FIS301'] },
                { id: 'INM401', name: 'Inmunología General', prerequisites: ['AGE301'] },
                { id: 'FOR401', name: 'Formulación y Evaluación de Proyectos', prerequisites: ['ADM301'] },
                { id: 'INV401', name: 'Módulo de Investigación en Medicina Veterinaria I', prerequisites: [] },
                { id: 'ING401', name: 'Inglés IV', prerequisites: ['ING301'] },
                { id: 'RSU401', name: 'Responsabilidad Social Universitaria', prerequisites: [] },
                { id: 'PRA401', name: 'Práctica Integrada I en Medicina Veterinaria', prerequisites: ['MOR201'] }
            ]
        },
        {
            number: 5,
            courses: [
                { id: 'PAT501', name: 'Patología Veterinaria', prerequisites: ['FIS401'] },
                { id: 'ENF501', name: 'Enfermedades Infecciosas y Parasitarias', prerequisites: ['INM401'] },
                { id: 'EPI501', name: 'Epidemiología', prerequisites: ['BIO301'] },
                { id: 'NUT501', name: 'Nutrición y Alimentación Animal', prerequisites: ['FIS401'] },
                { id: 'BIO501', name: 'Bioética y Bienestar Animal', prerequisites: ['ECO301'] },
                { id: 'PRA501', name: 'Práctica Integrada II en Medicina', prerequisites: ['PRA401'] }
            ]
        },
        {
            number: 6,
            courses: [
                { id: 'FAR601', name: 'Farmacología Veterinaria', prerequisites: ['FIS401'] },
                { id: 'SEM601', name: 'Semiología', prerequisites: ['FIS401'] },
                { id: 'SAL601', name: 'Salud Pública Veterinaria', prerequisites: ['ENF501', 'EPI501'] },
                { id: 'BAS601', name: 'Bases de Producción Animal Sustentable', prerequisites: ['NUT501'] },
                { id: 'BIO601', name: 'Biología y Conservación de Especies', prerequisites: ['BIO501'] },
                { id: 'PRA601', name: 'Práctica Integrada III en Medicina', prerequisites: ['PRA501'] }
            ]
        },
        {
            number: 7,
            courses: [
                { id: 'REP701', name: 'Reproducción y Obstetricia Animal', prerequisites: ['FIS401','SEM601'] },
                { id: 'IMA701', name: 'Imagenología Diagnóstica', prerequisites: ['SEM601'] },
                { id: 'INO701', name: 'Inocuidad y Calidad Alimentaria', prerequisites: ['SAL601'] },
                { id: 'PRO701', name: 'Producción de Rumiantes', prerequisites: ['BAS601'] },
                { id: 'MAN701', name: 'Manejo y Conservación de Fauna Silvestre', prerequisites: ['BIO601'] },
                { id: 'PRA701', name: 'Práctica Integrada IV en Medicina', prerequisites: ['PRA601'] }
            ]
        },
        {
            number: 8,
            courses: [
                { id: 'HEM801', name: 'Hematología y Bioquímica Clínica', prerequisites: ['SEM601'] },
                { id: 'MED801', name: 'Medicina Interna de Animales Mayores', prerequisites: ['SEM601','IMA701'] },
                { id: 'INS801', name: 'Inspección Veterinaria de Alimentos', prerequisites: ['INO701'] },
                { id: 'PRO801', name: 'Producción y Patología Aviar', prerequisites: ['PAT501','BAS601'] },
                { id: 'LEG801', name: 'Legislación y Evaluación de Impacto Ambiental', prerequisites: ['MAN701'] },
                { id: 'INV801', name: 'Módulo de Investigación en Medicina Veterinaria II', prerequisites: ['INV401'] },
                { id: 'PRA801', name: 'Práctica Integrada V en Medicina', prerequisites: ['PRA701'] }
            ]
        },
        {
            number: 9,
            courses: [
                { id: 'CIR901', name: 'Cirugía Veterinaria', prerequisites: ['FAR601','MED801'] },
                { id: 'MED901', name: 'Medicina Interna de Animales Menores', prerequisites: ['MED801'] },
                { id: 'INT901', name: 'Internado de Salud Pública', prerequisites: ['INS801'] },
                { id: 'ACU901', name: 'Acuicultura y Patología de Peces', prerequisites: ['PAT501'] },
                { id: 'INT902', name: 'Internado y Conservación de Biodiversidad', prerequisites: ['LEG801'] },
                { id: 'TIT901', name: 'Trabajo de Titulación I', prerequisites: [] },
                { id: 'ELE901', name: 'Electivo de Formación General I', prerequisites: [] }
            ]
        },
        {
            number: 10,
            courses: [
                { id: 'INT1001', name: 'Internado Quirúrgico', prerequisites: ['CIR901'] },
                { id: 'INT1002', name: 'Internado Medicina Interna', prerequisites: ['MED901'] },
                { id: 'ELE1001', name: 'Electivo de Profundización', prerequisites: [] },
                { id: 'INT1003', name: 'Internado Producción Animal', prerequisites: ['ACU901'] },
                { id: 'TIT1001', name: 'Trabajo de Titulación II', prerequisites: [] },
                { id: 'ELE1002', name: 'Electivo de Formación General II', prerequisites: [] }
            ]
        }
    ]
}; 