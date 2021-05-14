declare module extendStack {
  /**
   * Adds the error stack of the calling function in case an error occurs.
   * 
   * @param cb Callback to be wrapped.
   * @returns New callback that adds a stack if necessary.
   */
  function extendCb (cb: (err: Error | any, data: any) => void): ((err: Error, data: any) => void)
  
  /**
   * Extends the stack with the current stack
   * 
   * @param err Error to get the stack added (non-objects get transformed to objects)
   * @param offset (default=0) Additional lines to remove from the stack
   * @returns New error that contains the stack 
   */
  function extendStack(err: Error | any, offset?: number): Error
}

export = extendStack
