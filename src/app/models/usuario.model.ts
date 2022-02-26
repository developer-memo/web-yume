
export class Usuario {

  constructor(
    public usuario: object,
    public nombre: string,
    public tipoIdentifica: string,
    public numIdentifica: string,
    public ciudad: string,
    public fechNacimiento: string,
    public genero: string,
    public direccion: string,
    public activEconomica: string,
    public ingresos: string,
    public egresos: string,
    public activos: string,
    public pasivos: string,
    public patrimonios: string,
    public pep: string,
    public _id?: string,
  ){}

}