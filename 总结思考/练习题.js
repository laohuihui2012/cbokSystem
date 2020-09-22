var x = 3,
    obj = {x: 5};
obj.fn = (function () {
    this.x *= ++x;
    return function (y) {
        this.x *= (++x)+y;
        console.log(x);
    }
})();
var fn = obj.fn;
obj.fn(6);
fn(4);
console.log(obj.x, x);

```
全局  x => 3  obj => x001 => { x: 5 }
              x001 => {  //x: 5,
                  fn:funtion(){this.x *= (++x)+y;
                    console.log(x);}
                } 

    EC(obj.fn)  X002 => function (y) {
        this.x *= (++x)+y;
        console.log(x);
    }

    EC(G) x = 12  X001 x = 5

    X = 5  5*(12+1+6) = 95

    EC(G)  x =  13  X001 x = 95

       13*(13+1 + 4) = 234


       obj.fn(6);//13
       fn(4);//95
       console.log(obj.x, x);//95,234

```

