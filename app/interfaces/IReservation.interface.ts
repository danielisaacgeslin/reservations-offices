interface IReservation {
    id?: number,
    title: string,
    description: string,
    body: string,
    space: number,
    date: Date,
    from_time: number,
    to_time: number,
    creation_timestamp?: Date,
    edition_timestamp?: Date,
    creation_user?: number,
    edition_user?: number
}
