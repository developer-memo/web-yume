export interface Projects {
  id:          string;
  nombre:      string;
  descripcion: string;
  imagen:      string;
  sitio:       string;
  tipo:        string;
}


export const DisplayedColumnsPro: string[] = ['id', 'nombre', 'imagen', 'descripcion', 'sitio', 'tipo', 'acciones'];

export const dropdownTypeSkills = [
  {value: 'HTML5', text: 'HTML 5'},
  {value: 'CSS3', text: 'CSS 3'},
  {value: 'SASS', text: 'SASS'},
  {value: 'TAILWINDSCC', text: 'TailwindCss'},
  {value: 'MATERIAL', text: 'Material'},
  {value: 'BOOTSTRAP', text: 'Bootstrap'},
  {value: 'JAVASCRIPT', text: 'Javascript'},
  {value: 'TYPESCRIPT', text: 'Typescript'},
  {value: 'ANGULAR+', text: 'Angular+'},
  {value: 'IONIC+', text: 'Ionic+'},
  {value: 'NODEJS', text: 'NodeJs'},
  {value: 'WEBPACK', text: 'Webpack'},
  {value: 'GULP', text: 'Gulp'},
  {value: 'WORDPRESS', text: 'Wordpress'},
  {value: 'MONGOBD', text: 'MongoBD'},
  {value: 'MYSQL', text: 'MySQL'},
  {value: 'FIREBASE', text: 'Firebase'},
  {value: 'JSON', text: 'Json'},
  {value: 'GIT', text: 'Git'},
]
