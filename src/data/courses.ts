import { Course } from '@/types'

export const courses: Course[] = [
  // Free Courses
  {
    id: '1',
    name: 'CS50: Introdução à Ciência da Computação (Harvard)',
    link: 'https://cs50.harvard.edu/x/2024/',
    type: 'free',
    category: 'Programação',
    description: 'O famoso curso introdutório de Harvard sobre ciência da computação e programação.',
  },
  {
    id: '2',
    name: 'freeCodeCamp: Responsive Web Design',
    link: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    type: 'free',
    category: 'Frontend',
    description: 'Certificação completa de HTML5 e CSS3 com projetos práticos.',
  },
  {
    id: '3',
    name: 'JavaScript Algorithms and Data Structures (freeCodeCamp)',
    link: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    type: 'free',
    category: 'JavaScript',
    description: 'Aprenda JavaScript moderno, ES6+, algoritmos e estruturas de dados.',
  },
  {
    id: '4',
    name: 'Python para Todos (Universidade de Michigan)',
    link: 'https://www.py4e.com/',
    type: 'free',
    category: 'Python',
    description: 'Curso gratuito do Dr. Charles Severance para aprender Python do zero.',
  },
  {
    id: '5',
    name: 'Git e GitHub para Iniciantes (DIO)',
    link: 'https://web.dio.me/track/git-github',
    type: 'free',
    category: 'Ferramentas',
    description: 'Domine versionamento de código com Git e GitHub na prática.',
  },
  {
    id: '6',
    name: 'React Official Tutorial',
    link: 'https://react.dev/learn',
    type: 'free',
    category: 'React',
    description: 'Documentação oficial interativa do React com exemplos práticos.',
  },
  {
    id: '7',
    name: 'TypeScript Handbook',
    link: 'https://www.typescriptlang.org/docs/',
    type: 'free',
    category: 'TypeScript',
    description: 'Guia oficial completo do TypeScript, do básico ao avançado.',
  },
  {
    id: '8',
    name: 'SQL Bolt - Interactive SQL Tutorial',
    link: 'https://sqlbolt.com/',
    type: 'free',
    category: 'Banco de Dados',
    description: 'Aprenda SQL com lições interativas no navegador.',
  },

  // Paid Courses
  {
    id: '9',
    name: 'Complete Web Developer Bootcamp (Angela Yu - Udemy)',
    link: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
    type: 'paid',
    category: 'Full Stack',
    description: 'O curso mais completo de desenvolvimento web - HTML, CSS, JS, Node, React, MongoDB.',
  },
  {
    id: '10',
    name: 'React - The Complete Guide (Maximilian Schwarzmüller - Udemy)',
    link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
    type: 'paid',
    category: 'React',
    description: 'Domine React, Redux, Next.js, TypeScript e Testing.',
  },
  {
    id: '11',
    name: 'Node.js, Express, MongoDB & More (Jonas Schmedtmann - Udemy)',
    link: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
    type: 'paid',
    category: 'Backend',
    description: 'Crie APIs RESTful completas com Node.js, Express e MongoDB.',
  },
  {
    id: '12',
    name: 'TypeScript: The Complete Developer\'s Guide (Stephen Grider - Udemy)',
    link: 'https://www.udemy.com/course/typescript-the-complete-developers-guide/',
    type: 'paid',
    category: 'TypeScript',
    description: 'Padrões avançados de TypeScript para aplicações reais.',
  },
  {
    id: '13',
    name: 'AWS Certified Solutions Architect (Stephane Maarek - Udemy)',
    link: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
    type: 'paid',
    category: 'Cloud',
    description: 'Prepare-se para a certificação AWS SAA-C03 com laboratórios práticos.',
  },
  {
    id: '14',
    name: 'Docker e Kubernetes: The Complete Guide (Stephen Grider - Udemy)',
    link: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
    type: 'paid',
    category: 'DevOps',
    description: 'Containerize aplicações e orquestre com Kubernetes na prática.',
  },
  {
    id: '15',
    name: 'Design Patterns em JavaScript/TypeScript (Refactoring.Guru)',
    link: 'https://refactoring.guru/design-patterns/typescript',
    type: 'paid',
    category: 'Arquitetura',
    description: 'Aprenda todos os 23 padrões GoF com exemplos em TypeScript.',
  },
  {
    id: '16',
    name: 'Sistema Design Interview (Alex Xu - ByteByteGo)',
    link: 'https://bytebytego.com/',
    type: 'paid',
    category: 'Arquitetura',
    description: 'Prepare-se para entrevistas de system design das Big Techs.',
  },
]

export function getCoursesByType(type: 'free' | 'paid'): Course[] {
  return courses.filter((course) => course.type === type)
}

export function getRandomCourse(type: 'free' | 'paid'): Course {
  const filtered = getCoursesByType(type)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export function getCategories(type?: 'free' | 'paid'): string[] {
  const filtered = type ? getCoursesByType(type) : courses
  return [...new Set(filtered.map((c) => c.category).filter(Boolean))] as string[]
}