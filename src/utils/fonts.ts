export interface IFont {
    file: string
    name: string
}

export const fonts: IFont[] = [
    {
        file: 'VLADIMIR.json',
        name: 'VLADIMIR'
    },
    {
        file: 'Roboto_Regular.json',
        name: 'Roboto'
    },
]

export const FontSizes: number[] = [0.1, 0.2, 0.3];