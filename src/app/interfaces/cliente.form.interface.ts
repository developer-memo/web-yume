export interface ClienteForm {
  idUs:      number;
  nombre:    string;
  email:     string;
  password:  string;
  password2?:  string;
  telefono:  number;
  direccion: string;
  estado:    boolean;
  terminos?:    boolean;
  genero:    string;
  admin:     string;
  fecha:     string;
}
