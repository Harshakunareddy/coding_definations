str.split('').reverse().join('');


a , b => temp = a, a = b , b = temp

Math.max(...arr);
[...new Set(arr)]


let ch = {};

for (let i of ch){
    ch[i] = (ch[i] || 0) + 1;
}

for (let i = 2; i<Math.sqrt(num); i++){
    if(num[i] % 2 !== 0){
        return false;
    }
    else{
        return true;
    }
}

num, 
fact => 
a = 1;
for(let i =1; i<=num; i++){
    a = a * i;
}
return a


arr.filter((a)=> a % 2 === 0);
arr.filter((a)=> a % 2 !== 0);
return {even,odd};

total = (n * n+1) / 2;
arr.reduce((a,b) => a+b);


uniqArray = new Set(arr1);

for (let i=0; i<=arr2.length; i++){
    if(uniqArray.has(arr2[i])){
        result.push(arr2[i]);
    }
}