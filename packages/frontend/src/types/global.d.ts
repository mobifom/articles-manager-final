interface Window {
    fs: {
      readFile: (path: string, options?: any) => Promise<any>;
    }
  }