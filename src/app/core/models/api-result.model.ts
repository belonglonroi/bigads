export class ApiResult<T> {
    data: T;
}

export class ApiPagingResult<T> {
    data: DataResult<T>
}

export class DataResult<T> {
    filter?: any;
    paginate?: any;
    records?: T;
    total?: any;
    statistical?: any;
}
