interface IHandleError {
  code: string;
  error: any;
  set: any;
}

export function handleError({ code, error, set }: IHandleError) {
  set.status = error.status;
  switch (code) {
    case 'VALIDATION':
      // Find a specific error name (path is OpenAPI Schema compliance)
      const name = error.all.find((x: any) => x.path === '/name');

      // If has validation error, then log it
      if (name) console.log(name);
      return {
        success: false,
        message: code,
        error: error.validator.schema,
      };
    default:
      return {
        success: false,
        message: code,
      };
  }
}
