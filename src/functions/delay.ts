// export default function delay(t:any, v: any) {
//     return new Promise(function(resolve) { 
//         setTimeout(resolve.bind(null, v), t)
//     });
//   }
export default function delay(v: any) {
    return new Promise(function(resolve) { 
        setTimeout(resolve.bind(null, v))
    });
  }