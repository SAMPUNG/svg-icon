export type Loader = (name: string) => string

export function defineLoader(loader: Loader): void

export function registerSymbol(name: string): Promise<void>
