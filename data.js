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
                { id: 'QUI201', name: 'Química y Bioquímica para la Vida', prerequisites: [] },
                { id: 'MOR201', name: 'Morfología Micro y Macroscópica II', prerequisites: ['MOR101'] },
                { id: 'GEN201', name: 'Genética Animal', prerequisites: [] },
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
                { id: 'ECO301', name: 'Ecología', prerequisites: [] },
                { id: 'ING301', name: 'Inglés III', prerequisites: ['ING201'] },
                { id: 'ETI301', name: 'Ética y Ciudadanía', prerequisites: [] },
                { id: 'PRA301', name: 'Práctica Integrada I en Medicina Veterinaria', prerequisites: ['INT101'] }
            ]
        },
        {
            number: 4,
            courses: [
                { id: 'FIS401', name: 'Fisiología y Fisiopatología II', prerequisites: ['FIS301'] },
                { id: 'INM401', name: 'Inmunología General', prerequisites: ['AGE301'] },
                { id: 'FOR401', name: 'Formulación y Evaluación de Proyectos', prerequisites: [] },
                { id: 'ING401', name: 'Inglés IV', prerequisites: ['ING301'] },
                { id: 'RSU401', name: 'Responsabilidad Social Universitaria', prerequisites: ['ETI301'] },
                { id: 'INV401', name: 'Módulo de Investigación en Medicina Veterinaria I', prerequisites: [] }
            ]
        },
        {
            number: 5,
            courses: [
                { id: 'PAT501', name: 'Patología Veterinaria', prerequisites: ['FIS401', 'INM401'] },
                { id: 'ENF501', name: 'Enfermedades Transmisibles', prerequisites: ['AGE301', 'INM401'] },
                { id: 'EPI501', name: 'Epidemiología', prerequisites: ['BIO301'] },
                { id: 'NUT501', name: 'Nutrición y Alimentación Animal', prerequisites: ['ZOO201', 'ECO301'] },
                { id: 'BIO501', name: 'Bioética y Bienestar Animal', prerequisites: ['MAT101'] },
                { id: 'PRA501', name: 'Práctica Integrada II en Medicina', prerequisites: ['PRA301'] }
            ]
        },
        {
            number: 6,
            courses: [
                { id: 'FAR601', name: 'Farmacología Veterinaria', prerequisites: ['FIS401'] },
                { id: 'SEM601', name: 'Semiología', prerequisites: ['PAT501'] },
                { id: 'SAL601', name: 'Salud Pública', prerequisites: [] },
                { id: 'BAS601', name: 'Bases de Producción Animal Sustentable', prerequisites: [] },
                { id: 'BIO601', name: 'Biología y Conservación de la Diversidad', prerequisites: [] },
                { id: 'INV601', name: 'Módulo de Investigación en Medicina Veterinaria II', prerequisites: ['INV401'] },
                { id: 'PRA601', name: 'Práctica Integrada III en Medicina', prerequisites: ['PRA501'] }
            ]
        },
        {
            number: 7,
            courses: [
                { id: 'REP701', name: 'Reproducción y Obstetricia Animal', prerequisites: [] },
                { id: 'IMA701', name: 'Imagenología Diagnóstica', prerequisites: ['SEM601'] },
                { id: 'PRO701', name: 'Producción de Rumiantes', prerequisites: ['BAS601'] },
                { id: 'MAN701', name: 'Manejo y Conservación de Fauna Silvestre', prerequisites: ['BIO601'] },
                { id: 'INO701', name: 'Inocuidad y Calidad Alimentaria', prerequisites: ['SAL601'] },
                { id: 'PRA701', name: 'Práctica Integrada IV en Medicina', prerequisites: ['PRA601'] }
            ]
        },
        {
            number: 8,
            courses: [
                { id: 'HEM801', name: 'Hematología y Bioquímica Clínica', prerequisites: ['IMA701'] },
                { id: 'MED801', name: 'Medicina Interna de Animales Mayores', prerequisites: ['PRO701'] },
                { id: 'INS801', name: 'Inspección Veterinaria de Carnes', prerequisites: ['INO701'] },
                { id: 'PRO801', name: 'Producción y Patología Aviar', prerequisites: ['SAL601'] },
                { id: 'LEG801', name: 'Legislación y Evaluación de Impacto Ambiental', prerequisites: ['MAN701'] },
                { id: 'PRA801', name: 'Práctica Integrada V en Medicina', prerequisites: ['PRA701'] }
            ]
        },
        {
            number: 9,
            courses: [
                { id: 'CIR901', name: 'Cirugía Veterinaria', prerequisites: ['SEM601'] },
                { id: 'MED901', name: 'Medicina Interna de Animales Menores', prerequisites: ['HEM801'] },
                { id: 'INT901', name: 'Internado de Salud Pública', prerequisites: ['SAL601'] },
                { id: 'ACU901', name: 'Acuicultura y Patología de Peces', prerequisites: ['PRO801'] },
                { id: 'INT902', name: 'Internado de Medicina de Fauna Silvestre', prerequisites: ['MAN701'] },
                { id: 'TIT901', name: 'Trabajo de Titulación I', prerequisites: ['INV601'] },
                { id: 'ELE901', name: 'Electivo de Formación General I', prerequisites: [] }
            ]
        },
        {
            number: 10,
            courses: [
                { id: 'INT1001', name: 'Internado Quirúrgico', prerequisites: ['CIR901'] },
                { id: 'INT1002', name: 'Internado Medicina Interna', prerequisites: ['MED801', 'MED901'] },
                { id: 'INT1003', name: 'Internado Producción Animal', prerequisites: ['PRO701', 'PRO801'] },
                { id: 'ELE1001', name: 'Electivo de Profundización', prerequisites: [] },
                { id: 'TIT1001', name: 'Trabajo de Titulación II', prerequisites: ['TIT901'] },
                { id: 'ELE1002', name: 'Electivo de Formación General II', prerequisites: [] }
            ]
        }
    ]
}; 