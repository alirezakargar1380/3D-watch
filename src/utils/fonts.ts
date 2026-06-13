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
export const FontPositions: any[] = [
    {
        id: 1,
        x: 0, y: 0.5, name: 'bottom'
    },
    {
        id: 2,
        x: 0.8, y: 0, name: 'right'
    },
    {
        id: 4,
        x: -0.8, y: 0, name: 'left'
    },
    {
        id: 3,
        x: 0, y: -0.5, name: 'top'
    }
];