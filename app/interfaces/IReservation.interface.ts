interface IReservation {
    id: number,
    creation_timestamp: Date,
    edition_timestamp: Date,
    title: string,
    description: string,
    body: string,
    space: number,
    date: Date,
    from_time: number,
    to_time: number,
    creation_user: number,
    edition_user: number
}
