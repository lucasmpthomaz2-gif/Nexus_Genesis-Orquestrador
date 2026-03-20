export const eq = (a: any, b: any) => ({ type: "eq", a, b });
export const desc = (a: any) => ({ type: "desc", a });
export const and = (...args: any[]) => ({ type: "and", args });
export const gte = (a: any, b: any) => ({ type: "gte", a, b });
export const lte = (a: any, b: any) => ({ type: "lte", a, b });
export const like = (a: any, b: any) => ({ type: "like", a, b });

export const drizzle = (url: string) => ({
  select: () => ({
    from: (table: any) => ({
      where: () => ({
        limit: () => Promise.resolve([]),
        orderBy: () => ({
          limit: () => Promise.resolve([])
        })
      }),
      orderBy: () => ({
        limit: () => Promise.resolve([])
      }),
      limit: () => Promise.resolve([])
    })
  }),
  insert: (table: any) => ({
    values: (data: any) => ({
      onDuplicateKeyUpdate: () => Promise.resolve({ insertId: 1 })
    })
  }),
  update: (table: any) => ({
    set: (data: any) => ({
      where: () => Promise.resolve({ affectedRows: 1 })
    })
  })
});
