// src/data/skills.js
export const skillGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'HTML', note: 'Semantic markup, accessibility basics, forms', icon: 'Code2' },
      { name: 'CSS', note: 'Layouts, flexbox, grid, animations, responsive', icon: 'Palette' },
      { name: 'JavaScript', note: 'DOM, events, async/await, ES6+ features', icon: 'Braces' },
      { name: 'React', note: 'Components, hooks, state, props, JSX', icon: 'Component' },
      { name: 'Tailwind CSS', note: 'Utility-first styling, dark mode, responsive design', icon: 'Wind' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'PHP', note: 'Server-side scripting, OOP, form handling', icon: 'Server' },
      { name: 'MySQL', note: 'Database design, queries, relationships', icon: 'Database' },
      { name: 'Laravel', note: 'MVC pattern, Eloquent ORM, routing', icon: 'Layers' },
      { name: 'REST APIs', note: 'Building and consuming RESTful services', icon: 'Globe' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git & GitHub', note: 'Version control, branches, pull requests', icon: 'GitBranch' },
      { name: 'VS Code', note: 'Editor workflow, extensions, debugging', icon: 'Code' },
      { name: 'Figma', note: 'Design handoff, wireframes, prototyping', icon: 'PenTool' },
      { name: 'npm', note: 'Package management, scripts, dependencies', icon: 'Package' },
    ],
  },
]
