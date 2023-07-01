export interface DataRegister {
    entity: string,
    email: string,
    password: string,
    tableId?: string,
}

export interface ColumnsTableCreate {
    name: string,
    label: string,
    field: string,
    align: 'left',
}

export interface vModelSelect {
    label: string,
    value: string,
    rest?: any
}

export interface rowsTableCreateOrRead {
    date: string;
    [key: string]: string;
}

export interface TypeGetTable {
    cols: ColumnsTableCreate[],
    created_at: string,
    days_week: vModelSelect[],
    id: number,
    id_table: string,
    event_id: string,
    name_table: string,
    next_update: string,
    rows: rowsTableCreateOrRead[],
    updated_at: string,
}