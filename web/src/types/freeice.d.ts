declare module 'freeice'{
  interface stunServer {
    credential?: any,
    url: string,
    urls: Array<string>,
    username?: any
  }
  interface opts {
    stun: Array<string>,
    turn: Array<string>,
    stunCount: number,
    turnCount: number,
  }

 function freeice(opts?: opts): stunServer[];
 export = freeice
}

// // export function freeice<any>(): stunServer;
// export const freeice: any
