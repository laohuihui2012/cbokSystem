// ```
// class Cash {
//     //....待实现
// }

// const cash1 = new Cash(186);
// const cash2 = new Cash(53);

// const sum1 = cash1.add(cash2);
// const sum2 = Cash.add(cash1,cash2);
// const sum3 = new Cash(cash1 + cash2);

// console.log(sum1);
// console.log(sum2);
// console.log(sum3);
// //要求均输出200-30-9
// ```

function handle(value) {
    let length = JSON.stringify(value).length;
    let i = [].map.call(JSON.stringify(value) + "", (num, index) => {
        let nums = length - index - 1;
        return num + new Array(nums).fill("0").join("");
    });
    console.log(i);
    return i.join("-");
}

class Cash {
    constructor(value) {
        this.primitiveValue = value;
        this.str = handle(value);
        console.log(this.str);
        let result = new String(this.str);
        console.log(result);
        console.log(this);
        Object.setPrototypeOf(result, this);
        return result;
    }

    add(cash) {
        return new Cash(this + cash).str;
    }

    static add(c1, c2) {
        return c1.add(c2);
    }

    valueOf(){
        return this.primitiveValue;
    }
}


const cash1 = new Cash(186);
const cash2 = new Cash(53);

// const sum1 = cash1.add(cash2);
// const sum2 = Cash.add(cash1,cash2);
// const sum3 = new Cash(cash1 + cash2);

console.log(sum1);
console.log(sum2);
console.log(sum3);

// ```
// class Cash {
//     constructor(value) {
//       this.value = value;
//     }
  
//     static add(...cashes) {
//         console.log(cashes);
        
//       const sum = cashes.reduce((pre, cur) => pre + cur) + '';
//       console.log(sum);
//       return new Cash(sum);
//     }
  
//     add(cash) {
//         console.log(cash);
//       return Cash.add(this, cash);
//     }
  
//     toString() {
//       const sum = (this + '').padStart(3, 0);
//       console.log(this);
//       return `${sum[0]}元${sum[1]}角${sum[2]}分`;
//     }
  
//     valueOf() {
//       return this.value;
//     }
//   }
  
//   const cash1 = new Cash(105);
  
//   const cash2 = new Cash(66);
  
//   const cash3 = cash1.add(cash2);
  
//   const cash4 = Cash.add(cash1, cash2);
  
//   const cash5 = new Cash(cash1 + cash2);
  
  
//   console.log(`${cash3}`, `${cash4}`, `${cash5}`); //1元7角1分 1元7角1分 1元7角1分
//   ```