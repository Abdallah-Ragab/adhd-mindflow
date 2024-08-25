import { Prisma } from '@prisma/client'

// Define the extension
const existsExtension = Prisma.defineExtension({
    name: 'Entry Existence check Extension',
    model: {
        $allModels: {
          async exists<T>(
            this: T,
            where: Prisma.Args<T, 'findFirst'>['where']
          ): Promise<boolean> {
            // Get the current model at runtime
            const context = Prisma.getExtensionContext(this)
    
            const result = await (context as any).findFirst({ where })
            return result !== null
          },
        },
      },
})

export { existsExtension }