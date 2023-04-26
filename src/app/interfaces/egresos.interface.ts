export interface Egresos {
  id_egre:         string;
  id_fina:         number;
  id_us:           number;
  valor_egre:      number;
  tipo_egre:       string;
  comentario_egre: string;
  prestamo_egre:   number;
  detalles_egre:   string;
  fecha_egre:      string;
  acciones?:       string;
}

export const DisplayedColumnsEgre: string[] = ['id_egre', 'valor_egre', 'comentario_egre', 'prestamo_egre', 'fecha_egre', 'acciones'];


export const dropdownTypeEgre = [
  {tipo: 'GASTO_FIJO', text_tipo: 'Gasto fijo'},
  {tipo: 'GASTO_VARIADO', text_tipo: 'Gasto variado'},
  {tipo: 'PRESTAMO', text_tipo: 'Préstamo'},
  {tipo: 'PAGO_INTERESES', text_tipo: 'Pago intereses'},
  {tipo: 'PAGO_CREDITO', text_tipo: 'Pago crédito'},
]