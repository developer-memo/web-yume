

export enum TypeProjects {
  app_mobile = 'APP_MOBILE',
  web_pages = 'WEB_PAGES',
  portofio = 'PORTFOLIO',
  landing_pages = 'LANDING_PAGES',
  platform = 'PLATFORM'
}

export type TypeProjectsMap = {
  [key in TypeProjects]: {
    key: TypeProjects,
    name: string
  }
}

export const ProjectsType: TypeProjectsMap = {
  APP_MOBILE:{
    key: TypeProjects.app_mobile,
    name: 'App Mobile'
  },
  WEB_PAGES:{
    key: TypeProjects.web_pages,
    name: 'Página Web'
  },
  PORTFOLIO: {
    key: TypeProjects.portofio,
    name: 'Portafolio'
  },
  LANDING_PAGES:{
    key: TypeProjects.landing_pages,
    name: 'Landing Pages'
  },
  PLATFORM:{
    key: TypeProjects.platform,
    name: 'Plataforma'
  }
}


export const DataTypeProject = [
  {
    key: 'APP_MOBILE',
    name: 'App Mobile'
  },
  {
    key: 'WEB_PAGES',
    name: 'Página Web'
  },
  {
    key: 'PORTFOLIO',
    name: 'Portafolio'
  },
  {
    key: 'LANDING_PAGES',
    name: 'Landing Pages'
  },
  {
    key: 'PLATFORM',
    name: 'Plataforma'
  },
]



