export interface Ingresos {
  id_ingre:           string;
  id_fina:            number;
  id_us:              number;
  valor_ingre:        number;
  comentario_ingre:   string;
  pago_credito_ingre: number;
  fecha_ingre:        string;
  tipo_ingre:         string;
  detalles_ingre:     string;
  acciones?:          string;
}


export const DisplayedColumnsIngre: string[] = ['id_ingre', 'valor_ingre', 'comentario_ingre', 'pago_credito_ingre', 'fecha_ingre', 'acciones'];


export const dropdownTypeIngre = [
  {tipo: 'INGRESO_FIJO', text_tipo: 'Ingreso fijo'},
  {tipo: 'INGRESO_VARIADO', text_tipo: 'Ingreso variado'},
  {tipo: 'PAGO_INTERESES', text_tipo: 'Pago intereses'},
  {tipo: 'PAGO_CREDITO', text_tipo: 'Pago crédito'},
]
